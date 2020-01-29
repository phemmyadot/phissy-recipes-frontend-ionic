import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subject } from 'rxjs';
import { Recipe } from 'src/app/core/models/recipe';
import { User } from 'src/app/core/models/user';
import { RecipesService } from 'src/app/core/services/business/recipes/recipes.service';
import { ModalController } from '@ionic/angular';
import { CreateRecipeComponent } from '../create/create.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {


  recipeId: string;
  recipe: Subject<Recipe>;
  creator: User;
  recipeObj: Recipe;
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private recipeService: RecipesService,
    private modal: ModalController, ) {
    this.recipe = this.recipeService.recipe;
    this.route.params.subscribe(params => {
      this.recipeId = params.id;
      this.recipeService.getRecipe(this.recipeId);
    });
    this.recipeService.getRecipeObs().subscribe(recipe => {
      console.log(recipe);
      this.recipeObj = recipe;
      this.recipeId = recipe.id;
      this.creator = recipe.creator;
    });
  }

  ngOnInit() {

  }

  openCreator() {
    this.router.navigate(['profile', 'info', this.creator._id]);
  }

  ionViewWillEnter() {
    this.authService.showHeader(false);
  }

  ngOnDestroy() {
    // this.store.dispatch(new ClearRecipe());
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.recipeId, this.creator.displayName);
  }

  onEdit() {
    this.modal.create({ component: CreateRecipeComponent, componentProps: { recipe: this.recipeObj } }).then(modalEl => {
      modalEl.present();
    });
  }

}
