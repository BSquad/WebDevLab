import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { UserPage } from './user-page';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast-service';
import { PathBuilder } from '../../services/path-builder';
import { MOCK_USER, MOCK_GAMES, MOCK_ACHIEVEMENTS, MOCK_GUIDES } from '../../tests/mock-data.spec';
import { AuthServiceMock, ToastServiceMock, PathBuilderMock } from '../../tests/mock-classes.spec';

describe('UserPage', () => {
    let component: UserPage;
    let fixture: ComponentFixture<UserPage>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let toastService: ToastServiceMock;
    let dialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        const userSpy = jasmine.createSpyObj('UserService', [
            'getUserProfile',
            'updateLayout',
            'startUserAnalysis',
        ]);
        const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

        await TestBed.configureTestingModule({
            imports: [UserPage],
            providers: [
                provideRouter([]),
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
                { provide: PathBuilder, useClass: PathBuilderMock },
                { provide: UserService, useValue: userSpy },
                { provide: MatDialog, useValue: matDialogSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserPage);
        component = fixture.componentInstance;

        userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
        toastService = TestBed.inject(ToastService) as any;
        dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

        userServiceSpy.getUserProfile.and.resolveTo({
            ...MOCK_USER,
            dashboardLayout: '["games", "analysis", "guides"]',
            games: MOCK_GAMES,
            achievements: MOCK_ACHIEVEMENTS,
            guides: MOCK_GUIDES,
        });

        fixture.detectChanges();
        await fixture.whenStable();
    });

    it('should create and load profile data', () => {
        expect(component).toBeTruthy();
        expect(userServiceSpy.getUserProfile).toHaveBeenCalledWith(MOCK_USER.id);
        expect(component.layoutOrder()).toEqual(['games', 'analysis', 'guides']);
    });

    it('should handle drag and drop layout updates', async () => {
        component.layoutOrder.set(['analysis', 'games', 'guides']);

        const dropEvent = {
            previousIndex: 0,
            currentIndex: 1,
        } as CdkDragDrop<string[]>;

        await component.drop(dropEvent);

        expect(component.layoutOrder()).toEqual(['games', 'analysis', 'guides']);
        expect(userServiceSpy.updateLayout).toHaveBeenCalledWith(MOCK_USER.id, [
            'games',
            'analysis',
            'guides',
        ]);
    });

    it('should start analysis and handle progress', async () => {
        const mockAnalysisData = {
            gameCount: 5,
            completionRate: 50,
            mostPlayedGenre: 'RPG',
            achievementCount: 20,
            completedGameCount: 2,
            createdGuidesCount: 1,
        };
        userServiceSpy.startUserAnalysis.and.callFake(async (id, onProgress) => {
            if (onProgress) onProgress(100);
            return mockAnalysisData;
        });

        await component.startAnalysis();

        expect(component.isAnalyzing()).toBeFalse();
        expect(component.analysisProgress()).toBe(100);
        expect(component.analysisResult()).toEqual(mockAnalysisData);
        expect(toastService.showSuccess).toHaveBeenCalledWith('Analysis Complete!');
    });
});
