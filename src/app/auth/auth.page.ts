import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../core/services/misc/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  loginForm: FormGroup;
  authError: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

  }

  onLogin() {
    this.authService.login(this.loginForm.value).subscribe(res => {
      this.loginForm.reset();
      this.router.navigateByUrl('/');
    }, err => {
      this.authError = err.error.errors[0].message;
    });
  }

  ionViewWillEnter() {
    this.authService.showHeader(false);
    this.authService.showTabs(false);
  }

  routeToSignup() {
    this.router.navigateByUrl('/auth/signup');
  }
}
