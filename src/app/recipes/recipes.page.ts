import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateRecipeComponent } from './create/create.component';
import { Recipe } from '../core/models/recipe';
import { User } from '../core/models/user';
import { AuthService } from '../core/services/misc/auth.service';
import { Store, Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AppState } from '../state/app.state';
import { RecipesService } from '../core/services/business/recipes/recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit, OnDestroy {

  recipes: Subject<Recipe[]>;
  totalRecipes: Subject<number>;
  user: User;

  @Select(AppState.getUserProfile) userProfile$: Observable<User>;

  constructor(
    private router: Router,
    private modal: ModalController,
    private authService: AuthService,
    private store: Store,
    private recipeService: RecipesService) {
    this.userProfile$.subscribe(user => {
      this.user = user;
      this.recipeService.getRecipes(this.user.displayName);
      this.recipes = this.recipeService.recipes;
      this.totalRecipes = this.recipeService.totalRecipes;
    });
  }

  ngOnInit() {

  }


  openRecipeDetail(id) {
    this.router.navigate(['recipes', 'detail', id]);
  }


  ionViewWillEnter() {
    this.authService.showHeader(true);
  }


  onCreateRecipe() {
    this.modal.create({ component: CreateRecipeComponent }).then(modalEl => {
      modalEl.present();
    });
  }


  ngOnDestroy() {
  }

}
