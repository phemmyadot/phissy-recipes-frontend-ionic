import { Component, OnInit, OnDestroy, HostListener, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, IonInfiniteScroll  } from '@ionic/angular';
import { CreateRecipeComponent } from './create/create.component';
import { Recipe } from '../core/models/recipe';
import { User } from '../core/models/user';
import { AuthService } from '../core/services/misc/auth.service';
import { Select } from '@ngxs/store';
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
  totalRecipes: number = 0;
  user: User;
  pageNumber: number = 1;
  newPageSize: number;
  pageSize: number = 10;
  isLoading: boolean;
  length: number = 0;
  
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @Select(AppState.getUserProfile) userProfile$: Observable<User>;

  constructor(
    private router: Router,
    private modal: ModalController,
    private authService: AuthService,
    private recipeService: RecipesService) {

  }

  async ngOnInit() {
    this.newPageSize = this.pageSize;
  }


  openRecipeDetail(id) {
    this.router.navigate(['recipes', 'detail', id]);
  }

  like (id, userId) {
    console.log(id, userId);
  }

  async ionViewWillEnter() {
    this.authService.showHeader(true);
    await this.userProfile$.subscribe(user => {
      this.user = user;
    });
    this.recipeService.getRecipes(this.user.displayName, this.pageNumber, this.pageSize, true);
    this.recipes = this.recipeService.recipes;
    this.recipeService.getTotalRecipes().subscribe(total => {
      this.totalRecipes = total;
    });
  }

  ionViewWillLeave () {
    this.newPageSize = this.pageSize;
  }

  onCreateRecipe() {
    this.modal.create({ component: CreateRecipeComponent }).then(modalEl => {
      modalEl.present();
    });
  }

  ngOnDestroy() {
  }
  loadData(event) {
    this.isLoading = true;
    setTimeout(() => {
      this.newPageSize += 1;
      this.length = 0;
      if (this.length < this.totalRecipes) {
        console.log('Loading data...');
        this.recipeService.getRecipes(this.user.displayName, this.pageNumber, this.newPageSize, false).then(res => {
          this.length++;
        });
        this.infiniteScroll.complete();
        console.log('Done');
      } else {
        console.log('No More Data');
        this.infiniteScroll.disabled = true;
      }
    }, 500);
    this.isLoading = false;
  }

}
