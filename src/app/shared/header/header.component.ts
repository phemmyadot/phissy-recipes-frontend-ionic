import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';
import { MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showHeader: Subject<boolean>;
  constructor(public authService: AuthService,
    private menu: MenuController) { }

  ngOnInit() {
    this.showHeader = this.authService.showHeaderBol;

  }

  openSideMenu() {
    // this.menu.enable(true, 'userMenu');
    this.menu.toggle('userMenu');
  }
}
