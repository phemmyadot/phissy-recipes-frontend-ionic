import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountConfirmationPage } from './account-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: AccountConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountConfirmationPageRoutingModule {}
