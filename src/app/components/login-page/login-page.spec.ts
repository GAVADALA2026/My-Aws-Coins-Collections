import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { signIn } from '../../actions/login.actions';
import { LoginPage } from './login-page';

interface LoginPageAccess {
  group: FormGroup;
  usernameCtrl: FormControl<string>;
  pwdCtrl: FormControl<string>;
  signIn(): void;
};

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let store: { dispatch: jest.Mock };
  let router: { navigate: jest.Mock };

  const page = () => component as unknown as LoginPageAccess;

  beforeEach(async () => {
    store = { dispatch: jest.fn() };
    router = { navigate: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideNoopAnimations(),
        { provide: Store, useValue: store },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders an invalid login form and disables submit by default', () => {
    expect(page().group.invalid).toBe(true);
    expect((fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).disabled).toBe(true);
  });

  it('marks controls as touched and does not authenticate invalid credentials', () => {
    page().signIn();
    expect(page().usernameCtrl.touched).toBe(true);
    expect(page().pwdCtrl.touched).toBe(true);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it.each(['', '1234567'])('rejects a password with %p', (password) => {
    page().usernameCtrl.setValue('gabriele');
    page().pwdCtrl.setValue(password);
    expect(page().group.invalid).toBe(true);
  });

  it('dispatches the entered credentials and navigates only for a valid form', () => {
    page().usernameCtrl.setValue('gabriele');
    page().pwdCtrl.setValue('password');
    page().signIn();

    expect(store.dispatch).toHaveBeenCalledWith(signIn({ username: 'gabriele', pwd: 'password' }));
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
