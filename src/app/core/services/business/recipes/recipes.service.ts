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
  recipesData: Recipe[];
  totalRecipes = new Subject<number>();
  isDeleted = new Subject<boolean>();
  isCreated = new Subject<boolean>();
  isEdited = new Subject<boolean>();
  userId: string;

  getTotalRecipes(): Observable<number> {
    return this.totalRecipes.asObservable();
  }

  getRecipesObs(): Observable<Recipe[]> {
    return this.recipes.asObservable();
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
    this.userId = user;
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
        if (r.creator._id === user) {
          r.creator.displayName = 'You';
        }
        const x = r.likes.find(x => x.userId === user);
        if (x) r.isLiked = true;
      });
      console.log(data.recipes);
      this.recipesData = data.recipes;
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
    this.recipeDataService.getRecipe(recipeId).subscribe(r => {
      if (r.creator._id === this.userId) {
        r.creator.displayName = 'You';
      }
      this.recipe.next(r);
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
      loading.dismiss();
    });
  }
  
  likeRecipe(recipeId: string, userId: string) {
    this.recipeDataService.likeRecipe(recipeId, userId);
  }



  likeSocket(recipe, status, user, likeId) {
    const like = {
      _id: likeId, 
      recipeId: recipe._id,
      userId: user
    }
    this.recipesData.map(r => {
      if (r.id === recipe._id && status === 1) {
        r.likes.push(like);
        r.likesCount += 1;
        const x = r.likes.find(x => x.userId === this.userId);
        if (x) r.isLiked = true;
      } else if (r.id === recipe._id && status === 0) {
        const newRecipe = r.likes.filter(x => x._id !== likeId);
        r.likes = newRecipe;
        r.likesCount -= 1;
        const x = r.likes.find(x => x.userId === this.userId);
        if (!x) r.isLiked = false;
      }
    });
    console.log(this.recipesData);
    this.recipes.next(this.recipesData);
  }

  updateRecipe(recipe, status) {
      if (recipe.creator._id === this.userId) {
        recipe.creator.displayName = 'You';
      }
      recipe.id = recipe._id;
      const x = recipe.likes.find(x => x.userId === this.userId);
      if (x) recipe.isLiked = true;
      if (status === 0) {
        this.recipesData.splice(0, 0, recipe);
      } else {
        const i = this.recipesData.findIndex(r => r.id == recipe._id);
        this.recipesData[i] = recipe;
      }
      console.log(this.recipesData)
      this.totalRecipes.next(this.recipesData.length);
      this.recipes.next(this.recipesData);
  }

  deleteRecipeSock(id) {
    const recipes = this.recipesData.filter(r => r.id !== id);
    this.recipes.next(recipes);
  }
}

