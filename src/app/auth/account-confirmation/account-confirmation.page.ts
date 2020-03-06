import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.page.html',
  styleUrls: ['./account-confirmation.page.scss'],
})
export class AccountConfirmationPage implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    (console.log(this.route.params));
  }

}
