import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe, RecipeData } from 'src/app/core/models/recipe';

@Injectable({
    providedIn: 'root'
})
export abstract class RecipesDataService {

    abstract getRecipe(recipeId: string): Observable<Recipe>;
    abstract deleteRecipe(recipeId: string): Observable<boolean>;
    abstract getRecipes(pageNumber: number, pageSize: number): Observable<RecipeData>;
    abstract createRecipe(formData: any, Media: File, isEdit: boolean): Observable<boolean>;
    abstract likeRecipe(recipeId: string, userId: string): Observable<any>;
}