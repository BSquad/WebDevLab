import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast', () => {
    let component: Toast;
    let fixture: ComponentFixture<Toast>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Toast],
            providers: [
                { provide: 'message', useValue: 'Test message' },
                { provide: 'type', useValue: 'info' },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Toast);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
