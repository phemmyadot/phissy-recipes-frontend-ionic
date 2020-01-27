import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { CreateRecipeComponent } from './create/create.component';
import { RecipesService } from '../core/services/business/recipes/recipes.service';
import { Recipe } from '../core/models/recipe';
import { User } from '../core/models/user';
import { AuthService } from '../core/services/misc/auth.service';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppState } from '../state/app.state';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Recipe[];
  totalRecipes: number;

  @Select(AppState.getUserProfile) userProfile$: Observable<User>;

  constructor(
    private router: Router,
    private menu: MenuController,
    private modal: ModalController,
    private recipeService: RecipesService,
    private authService: AuthService,
    private store: Store) { }

  ngOnInit() {

    this.userProfile$.subscribe(user => {

      this.recipeService.getRecipes().subscribe(data => {
        data.recipes.map(r => {
          if (r.creator.displayName === user.displayName) {
            r.creator.displayName = 'You';
          }
        });
        this.recipes = data.recipes;
        this.totalRecipes = data.totalRecipes;
      });

    })
  }

  openRecipeDetail() {
    this.router.navigateByUrl('/recipes/detail');
  }


  ionViewWillEnter() {
    this.authService.showHeader(true);
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
