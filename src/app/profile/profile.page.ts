import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/misc/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.authService.showHeader(false);
  }

}
