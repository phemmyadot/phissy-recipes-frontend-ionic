import { Component, OnInit, OnDestroy, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
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
  pageSize: number = 3;
  showSpinner: boolean;

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
  async onWindowScroll(e) {
      if (this.newPageSize < this.totalRecipes) {
        this.showSpinner = true;
        setTimeout(() => {
          const x = e.target.scrollTop;
          let pos = e.target.scrollTop + e.target.offsetHeight;
          let max = e.target.scrollHeight;
          if(pos == max )   {
            this.newPageSize += 1;
            this.recipeService.getRecipes(this.user.displayName, this.pageNumber, this.newPageSize, false).then(res => {
              this.showSpinner = false;
              e.target.scrollTop = x - 100;
            });
          }
        }, 1000);
      }
  }
}
