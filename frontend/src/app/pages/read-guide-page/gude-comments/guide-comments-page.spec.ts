import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommentsComponent } from './guide-comments-page';
import { CommentsService } from '../../../services/comment-service';
import { AuthService } from '../../../services/auth-service';
import { ToastService } from '../../../services/toast-service';
import { GuideComment } from '../../../../../../shared/models/guide-comment';
import { FormsModule } from '@angular/forms';

describe('CommentsComponent', () => {
    let component: CommentsComponent;
    let fixture: ComponentFixture<CommentsComponent>;

    let commentsServiceSpy: any;
    let authServiceSpy: any;
    let toastServiceSpy: any;

    const mockComments: GuideComment[] = [
        {
            id: 1,
            guideId: 1,
            userId: 1,
            commentText: 'Test comment',
            author: 'Tester',
            createdAt: new Date().toISOString(),
        },
    ];

    beforeEach(async () => {
        commentsServiceSpy = jasmine.createSpyObj('CommentsService', [
            'getComments',
            'createComment',
        ]);

        authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
        toastServiceSpy = jasmine.createSpyObj('ToastService', ['showError']);

        await TestBed.configureTestingModule({
            imports: [CommentsComponent, FormsModule],
            providers: [
                { provide: CommentsService, useValue: commentsServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CommentsComponent);
        component = fixture.componentInstance;
    });

    // =============================
    // BASIC
    // =============================
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // =============================
    // INPUT + LOAD
    // =============================
    it('should load comments when guideId is set', async () => {
        commentsServiceSpy.getComments.and.resolveTo(mockComments);

        component.guideId = 1;

        await fixture.whenStable();

        expect(commentsServiceSpy.getComments).toHaveBeenCalledWith(1);
        expect(component.comments().length).toBe(1);
    });

    it('should handle error when loading comments', async () => {
        commentsServiceSpy.getComments.and.rejectWith(new Error());

        component.guideId = 1;

        await fixture.whenStable();

        expect(toastServiceSpy.showError).toHaveBeenCalled();
    });

    // =============================
    // SUBMIT COMMENT
    // =============================
    describe('submit', () => {
        it('should submit comment successfully', async () => {
            commentsServiceSpy.getComments.and.resolveTo(mockComments);
            commentsServiceSpy.createComment.and.resolveTo(true);

            component.guideId = 1;
            component.newComment = 'Hello';

            authServiceSpy.getCurrentUser.and.returnValue({ id: 10 });

            await component.submitComment();

            expect(commentsServiceSpy.createComment).toHaveBeenCalledWith({
                guideId: 1,
                userId: 10,
                commentText: 'Hello',
            });
            expect(component.newComment).toBe('');
            expect(component.comments().length).toBe(1);
        });

        it('should not submit if no user', async () => {
            commentsServiceSpy.getComments.and.resolveTo(mockComments);

            component.guideId = 1;
            component.newComment = 'Hello';

            authServiceSpy.getCurrentUser.and.returnValue(null);

            await component.submitComment();

            expect(commentsServiceSpy.createComment).not.toHaveBeenCalled();
        });

        it('should not submit empty comment', async () => {
            commentsServiceSpy.getComments.and.resolveTo(mockComments);

            component.guideId = 1;
            component.newComment = '   ';

            authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });

            await component.submitComment();

            expect(commentsServiceSpy.createComment).not.toHaveBeenCalled();
        });

        it('should handle error when creating comment', async () => {
            commentsServiceSpy.getComments.and.resolveTo(mockComments);
            commentsServiceSpy.createComment.and.rejectWith(new Error());

            component.guideId = 1;
            component.newComment = 'Hello';

            authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });

            await component.submitComment();

            expect(toastServiceSpy.showError).toHaveBeenCalled();
        });
    });

    describe('template interactions', () => {
        it('should call submitComment when button clicked', () => {
            spyOn(component, 'submitComment');

            fixture.detectChanges();

            const button = fixture.nativeElement.querySelector('.normal-button');
            button.click();

            expect(component.submitComment).toHaveBeenCalled();
        });

        it('should bind textarea to newComment', () => {
            fixture.detectChanges();

            const textarea = fixture.nativeElement.querySelector('textarea');

            textarea.value = 'Test input';
            textarea.dispatchEvent(new Event('input'));

            expect(component.newComment).toBe('Test input');
        });

        it('should render comments list', () => {
            component.comments.set(mockComments);

            fixture.detectChanges();

            const items = fixture.nativeElement.querySelectorAll('.comment-item');
            expect(items.length).toBe(1);
        });

        it('should display comment text', () => {
            component.comments.set(mockComments);

            fixture.detectChanges();

            expect(fixture.nativeElement.textContent).toContain('Test comment');
        });

        it('should display author', () => {
            component.comments.set(mockComments);

            fixture.detectChanges();

            expect(fixture.nativeElement.textContent).toContain('Tester');
        });
    });
});
