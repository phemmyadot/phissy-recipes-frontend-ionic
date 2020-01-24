import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authService.showHeader(false);
    this.authService.showTabs(false);
  }

}
