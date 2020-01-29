import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/services/misc/auth.service';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetUserData } from '../state/app.action';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  loginForm: FormGroup;
  authErrors = [];
  authErrorsObs = new Subject<any>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigateByUrl('/recipes');
      }
    });
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async onLogin() {
    const loading = await this.loadingController.create({
      spinner: "dots",
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    this.authService.login(this.loginForm.value).subscribe(res => {
      this.store.dispatch(new SetUserData(res.data.login.user));
      this.loginForm.reset();
      this.router.navigateByUrl('/');
      loading.dismiss();
    }, err => {
      this.authErrorsObs.next(err.error.errors);
      loading.dismiss();
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
