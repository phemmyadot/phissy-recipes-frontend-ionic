import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { CreateRecipeComponent } from '../create/create.component';
import { RecipesPageModule } from '../recipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailPageRoutingModule,
    RecipesPageModule
  ],
  declarations: [DetailPage],
  entryComponents: [],
})
export class DetailPageModule { }
