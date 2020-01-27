import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';
import { MenuController } from '@ionic/angular';
import { Subject, Observable } from 'rxjs';
import { AppState } from 'src/app/state/app.state';
import { User } from 'src/app/core/models/user';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showHeader: Subject<boolean>;

  @Select(AppState.getUserProfile) userProfile$: Observable<User>;

  user: User;

  constructor(public authService: AuthService,
    private menu: MenuController) { }

  ngOnInit() {
    this.showHeader = this.authService.showHeaderBol;
    this.userProfile$.subscribe(user => {
      this.user = user;
    })
  }

  openSideMenu() {
    // this.menu.enable(true, 'userMenu');
    this.menu.toggle('userMenu');
  }
}
