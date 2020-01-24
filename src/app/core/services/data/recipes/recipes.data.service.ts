import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe, RecipeData } from 'src/app/core/models/recipe';

@Injectable({
    providedIn: 'root'
})
export abstract class RecipesDataService {

    abstract getRecipes(): Observable<RecipeData>;
}