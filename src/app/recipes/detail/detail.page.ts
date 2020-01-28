import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/services/misc/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { GetRecipe, ClearRecipe } from 'src/app/state/app.action';
import { AppState } from 'src/app/state/app.state';
import { Observable } from 'rxjs';
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

  @Select(AppState.getRecipe) recipe$: Observable<Recipe>;

  recipeId: string;
  recipe: Recipe;
  creator: User;
  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
    private recipeService: RecipesService,
    private modal: ModalController, ) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {
    //   this.store.dispatch(new GetRecipe(params.id));
    //   console.log(params.id);
    //   this.recipeId = params.id;
    // });


  }

  openCreator() {
    this.router.navigate(['profile', 'info', this.creator._id]);
  }

  ionViewWillEnter() {
    this.route.params.subscribe(params => {
      this.store.dispatch(new GetRecipe(params.id));
      console.log(params.id);
      this.recipeId = params.id;
      this.recipe$.subscribe(recipe => {
        this.recipe = recipe;
        console.log(recipe);
        this.creator = recipe.creator;
      });
    });
    this.authService.showHeader(false);
  }

  ngOnDestroy() {
    // this.store.dispatch(new ClearRecipe());
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.recipe.id).subscribe(isDeleted => {
      if (isDeleted) {
        this.router.navigate(['recipes']);
      }
    });
  }

  onEdit() {
    this.modal.create({ component: CreateRecipeComponent, componentProps: { recipe: this.recipe } }).then(modalEl => {
      modalEl.present();
    });
  }

}
