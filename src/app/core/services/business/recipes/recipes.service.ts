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

  getRecipe(recipeId: string): Observable<Recipe> {
    return this.recipeDataService.getRecipe(recipeId);
  }

  createRecipe(formData: any, Media: File, isEdit: boolean): Observable<Recipe> {
    return this.recipeDataService.createRecipe(formData, Media, isEdit);
  }

  deleteRecipe(recipeId: string): Observable<boolean> {
    return this.recipeDataService.deleteRecipe(recipeId);
  }
}
