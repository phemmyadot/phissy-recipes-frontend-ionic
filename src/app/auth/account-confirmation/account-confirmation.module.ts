import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountConfirmationPageRoutingModule } from './account-confirmation-routing.module';

import { AccountConfirmationPage } from './account-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountConfirmationPageRoutingModule
  ],
  declarations: [AccountConfirmationPage]
})
export class AccountConfirmationPageModule {}
