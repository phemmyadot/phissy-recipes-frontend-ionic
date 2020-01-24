import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { CreateRecipeComponent } from './create/create.component';
import { RecipesService } from '../core/services/business/recipes/recipes.service';
import { Recipe } from '../core/models/recipe';
import { User } from '../core/models/user';
import { AuthService } from '../core/services/misc/auth.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Recipe[];
  totalRecipes: number;

  constructor(
    private router: Router,
    private menu: MenuController,
    private modal: ModalController,
    private recipeService: RecipesService,
    private authService: AuthService) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes = data.recipes;
      this.totalRecipes = data.totalRecipes;
    });
  }

  openRecipeDetail() {
    this.router.navigateByUrl('/recipes/detail');
  }


  ionViewWillEnter() {
    this.authService.showHeader(true);
    this.authService.showTabs(true);
  }

  routeToProfile() {
    this.router.navigateByUrl('/profile');
  }
  onCreateRecipe() {
    this.modal.create({ component: CreateRecipeComponent }).then(modalEl => {
      modalEl.present();
    });
  }

}
