import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.authService.showHeader(false);
  }

}
