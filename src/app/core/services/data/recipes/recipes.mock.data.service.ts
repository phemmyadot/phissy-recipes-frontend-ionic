import { Injectable } from '@angular/core';
import { Recipe, RecipeData } from 'src/app/core/models/recipe';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
    providedIn: 'root'
})
export class RecipesMockDataService {

    getRecipes(): Observable<RecipeData> {
        return
    }
}