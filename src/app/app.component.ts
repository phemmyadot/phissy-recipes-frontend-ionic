import { Component, OnInit, Inject } from '@angular/core';

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
  isDark: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private socketService: SocketioService,
    // @Inject(DOCUMENT) private document: Document
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
    if(localStorage.getItem('isDark')) {
      this.isDark = localStorage.getItem('isDark') === 'true'? true : false;
    }
    this.changeMode(this.isDark);
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

  toggleMode(evt) {
    this.changeMode(evt.detail.checked);
    localStorage.setItem('isDark', evt.detail.checked);
  }
  changeMode(checked) {
    console.log(checked)
    if(checked) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}
