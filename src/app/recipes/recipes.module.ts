import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecipesPageRoutingModule } from './recipes-routing.module';

import { RecipesPage } from './recipes.page';
import { NgxsModule } from '@ngxs/store';
import { CreateRecipeComponent } from './create/create.component';
import { RecipesService } from '../core/services/business/recipes/recipes.service';
import { RecipesDataService } from '../core/services/data/recipes/recipes.data.service';
import { RecipesWebDataService } from '../core/services/data/recipes/recipes.web.data.service';
import { DateService } from '../core/services/misc/date.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecipesPageRoutingModule,
    NgxsModule.forFeature([])
  ],
  declarations: [RecipesPage, CreateRecipeComponent],
  entryComponents: [CreateRecipeComponent],
  providers: [
    RecipesService,
    DateService,
    { provide: RecipesDataService, useClass: RecipesWebDataService }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class RecipesPageModule { }
