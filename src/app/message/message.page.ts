import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/misc/auth.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.authService.showHeader(true);
    this.authService.showTabs(true);
  }

}
