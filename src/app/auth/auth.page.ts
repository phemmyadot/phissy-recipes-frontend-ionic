import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/services/misc/auth.service';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetUserData } from '../state/app.action';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  loginForm: FormGroup;
  authErrors = [];
  authErrorsObs = new Subject<any>();

  constructor(private authService: AuthService, private router: Router, private store: Store) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onLogin() {
    this.authService.login(this.loginForm.value).subscribe(res => {
      console.log('logged in', res);
      this.store.dispatch(new SetUserData(res.data.login.user));
      this.loginForm.reset();
      this.router.navigateByUrl('/');
    }, err => {
      this.authErrorsObs.next(err.error.errors);
    });
  }

  ionViewWillEnter() {
    this.authService.showHeader(false);
    this.loginForm.reset();
  }

  routeToSignup() {
    this.router.navigateByUrl('/signup');
  }

  forgetPassword() {

  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
