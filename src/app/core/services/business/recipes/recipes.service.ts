import { Injectable } from '@angular/core';
import { RecipesDataService } from '../../data/recipes/recipes.data.service';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe, RecipeData } from 'src/app/core/models/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private recipeDataService: RecipesDataService) { }

  getRecipes(): Observable<RecipeData> {
    return this.recipeDataService.getRecipes();
  }
}
