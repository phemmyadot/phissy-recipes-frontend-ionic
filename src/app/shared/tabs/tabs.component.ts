import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  showTabs: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.showTabsBol.subscribe(showTabs => {
      this.showTabs = showTabs;
    });
  }


}
