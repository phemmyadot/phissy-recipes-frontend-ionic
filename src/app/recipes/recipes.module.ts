import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';
import { NgxsModule } from '@ngxs/store';
import { CreateRecipeComponent } from './create/create.component';
import { DateService } from '../core/services/misc/date.service';
import { AppState } from '../state/app.state';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesPageRoutingModule,
    NgxsModule.forFeature([AppState]),
    ReactiveFormsModule
  ],
  declarations: [RecipesPage, CreateRecipeComponent],
  entryComponents: [CreateRecipeComponent],
  providers: [
    // RecipesService,
    DateService,
    // { provide: RecipesDataService, useClass: RecipesWebDataService }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class RecipesPageModule { }
