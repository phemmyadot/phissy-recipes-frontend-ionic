import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './core/services/misc/auth.service';
import { Router } from '@angular/router';
import { Select } from '@ngxs/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { User } from './core/models/user';
import { SocketioService } from './core/services/misc/socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  @Select(AppState.getUserProfile) user$: Observable<User>;

  user: User;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketioService
  ) {
    this.initializeApp();
  }


  ngOnInit() {
    this.authService.isAuthenticated().subscribe(isAuth => {
      if (!isAuth) {
        this.router.navigateByUrl('/auth');
      }
    });
    this.user$.subscribe(user => {
      this.user = user;
    });
    this.socketService.setupSocketConnection();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.authService.logout();
  }

  openProfile() {
    this.router.navigate(['profile', 'info', this.user._id]);
  }
}
