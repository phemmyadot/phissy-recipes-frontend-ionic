import { Injectable } from '@angular/core';
import { RecipesDataService } from '../../data/recipes/recipes.data.service';
import { Recipe, RecipeData } from 'src/app/core/models/recipe';
import { Subject, Observable } from 'rxjs';
import { ModalController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  getTotalRecipes(): Observable<number> {
    return this.totalRecipes.asObservable();
  }

  getRecipeObs(): Observable<Recipe> {
    return this.recipe.asObservable();
  }

  constructor(
    private recipeDataService: RecipesDataService,
    private modal: ModalController,
    private router: Router,
    public loadingController: LoadingController
  ) { }

  async getRecipes(user: string, pageNumber: number, pageSize: number, isFresh: boolean) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    if (isFresh) {
      await loading.present();
    }
    this.recipeDataService.getRecipes(pageNumber, pageSize).subscribe(data => {
      data.recipes.map(r => {
        if (r.creator.displayName === user) {
          r.creator.displayName = 'You';
        }
        const x = r.likes.find(x => x.userId === r.creator._id);
        if (x) r.isLiked = true;
      });
      console.log(data.recipes);
      this.recipes.next(data.recipes);
      this.totalRecipes.next(data.totalRecipes);
      if (isFresh) {
        loading.dismiss();
      }
    });
  }

  async getRecipe(recipeId: string) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    this.recipeDataService.getRecipe(recipeId).subscribe(data => {
      this.recipe.next(data);
      loading.dismiss();
    });
  }

  async createRecipe(formData: any, Media: File, isEdit: boolean, user: string) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();

    this.recipeDataService.createRecipe(formData, Media, isEdit).subscribe(res => {
      if (isEdit) {
        this.modal.dismiss();
        this.isEdited.next(true);
        this.getRecipe(formData.id);
      } else {
        this.modal.dismiss();
        this.isCreated.next(true);
        this.getRecipes(user, 1, 5, true);
      }
      loading.dismiss();
    });

  }

  async  deleteRecipe(recipeId: string, user: string) {
    const loading = await this.loadingController.create({
      spinner: "dots",
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await loading.present();
    this.recipeDataService.deleteRecipe(recipeId).subscribe(res => {
      this.router.navigate(['recipes']);
      this.isDeleted.next(res);
      this.getRecipes(user, 1, 5, true);
      loading.dismiss();
    });
  }
  
  likeRecipe(recipeId: string, userId: string) {
    return this.recipeDataService.likeRecipe(recipeId, userId);
  }
}
