import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CreateRecipeComponent } from './create/create.component';
import { Recipe } from '../core/models/recipe';
import { User } from '../core/models/user';
import { AuthService } from '../core/services/misc/auth.service';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AppState } from '../state/app.state';
import { GetRecipes } from '../state/app.action';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {

  recipes: Observable<Recipe[]>;
  totalRecipes: number;

  @Select(AppState.getUserProfile) userProfile$: Observable<User>;
  @Select(AppState.getRecipes) recipes$: Observable<Recipe[]>;
  @Select(AppState.getTotalRecipes) totalRecipes$: Observable<number>;

  constructor(
    private router: Router,
    private modal: ModalController,
    private authService: AuthService,
    private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetRecipes());
    this.totalRecipes$.subscribe(total => {
      this.totalRecipes = total;
    });
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

}
