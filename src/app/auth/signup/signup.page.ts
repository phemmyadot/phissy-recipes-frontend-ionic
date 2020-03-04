import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MustMatch } from './confirmPassword';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signupForm: FormGroup;
  authErrors = [];
  authErrorsLength: number = 0;
  fileData: File = null;
  imagePreview: any = '';

  public message: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (isAuth) {
        this.router.navigateByUrl('/recipes');
      }
    });
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      displayName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      image: [null, Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ionViewWillEnter() {
    this.authService.showHeader(false);
  }

  ionViewWillLeave()  {
    this.authErrors = [];
  }

  async onSignup() {
    const loading = await this.loadingController.create({
      spinner: "dots",
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    this.authService.signup(this.signupForm.value, this.signupForm.value.image).subscribe(res => {
      this.signupForm.reset();
      this.presentToast();
      this.router.navigateByUrl('/auth');
      loading.dismiss();
    }, err => {
      err.error.errors.forEach(err => {
        this.authErrors = err;
        loading.dismiss();
        this.presentErrorToast(err[0].message)
      });
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your account has been successfully created.',
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

  checkPasswords(controlName: string, matchingControlName: string, formGroup?: FormGroup) { // here we have the 'passwords' group
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }

  routeToLogin() {
    this.router.navigateByUrl('/auth');
  }


  onImagePicked(event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.signupForm.patchValue({ image: file });
    this.signupForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  get form() { return this.signupForm.controls; }

}
