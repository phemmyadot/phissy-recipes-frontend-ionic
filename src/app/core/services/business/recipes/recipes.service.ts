import { Injectable } from '@angular/core';
import { RecipesDataService } from '../../data/recipes/recipes.data.service';
import { Observable } from 'rxjs/internal/Observable';
import { Recipe, RecipeData } from 'src/app/core/models/recipe';
import { map } from 'rxjs/internal/operators/map';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  recipe = new Subject<Recipe>();
  recipes = new Subject<Recipe[]>();
  totalRecipes = new Subject<number>();
  isDeleted = new Subject<boolean>();
  isCreated = new Subject<boolean>();
  isEdited = new Subject<boolean>();

  constructor(private recipeDataService: RecipesDataService) { }

  getRecipes(user) {
    this.recipeDataService.getRecipes().subscribe(data => {
      data.recipes.map(r => {
        if (r.creator.displayName === user) {
          r.creator.displayName = 'You';
        }
        this.recipes.next(data.recipes);
        this.totalRecipes.next(data.totalRecipes);
      });
    });
  }

  getRecipe(recipeId: string) {
    this.recipeDataService.getRecipe(recipeId).subscribe(data => {
      this.recipe.next(data);
    });
  }

  createRecipe(formData: any, Media: File, isEdit: boolean) {
    this.recipeDataService.createRecipe(formData, Media, isEdit).subscribe(res => {
      if (isEdit) {
        this.isEdited.next(res);
      } else {
        this.isCreated.next(res);
      }
    });
  }

  deleteRecipe(recipeId: string) {
    this.recipeDataService.deleteRecipe(recipeId).subscribe(res => {
      this.isDeleted.next(res);
    });
  }
}
