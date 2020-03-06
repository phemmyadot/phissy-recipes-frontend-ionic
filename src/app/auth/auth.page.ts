import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/services/misc/auth.service';
import { Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { SetUserData } from '../state/app.action';
import { LoadingController, ToastController } from '@ionic/angular';
import { ErrorInterceptorService } from '../core/services/misc/error-interceptor.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  loginForm: FormGroup;
  authErrors: any[];
  authErrorsLength: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    public loadingController: LoadingController,
    public toastController: ToastController
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
      loading.dismiss();
      this.router.navigateByUrl('/');
      this.presentToast(res.data.login.user.displayName);
    }, err => {
      console.log('Login Failed With ---->', err);
      this.authErrors = err;
      this.authErrorsLength = err.length;
      this.presentErrorToast(err[0].message);
      loading.dismiss();
    });
  }

  ionViewWillEnter() {
    this.authService.showHeader(false);
    this.loginForm.reset();
  }

  ionViewWillLeave()  {
    this.authErrors = [];
  }

  routeToSignup() {
    this.router.navigateByUrl('/auth/signup');
  }

  forgetPassword() {

  }

  async presentToast(user) {
    const toast = await this.toastController.create({
      message: `Welcome ${user}`,
      duration: 2000,
      color: "primary"
    });
    toast.present();
  }
  async presentErrorToast(err) {
    const toast = await this.toastController.create({
      message: err,
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
