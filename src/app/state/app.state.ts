import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetUserData, ClearUserData, GetRecipes, CreateRecipe, GetRecipe, ClearRecipe, ClearRecipes } from './app.action';
import { User } from '../core/models/user';
import { RecipesService } from '../core/services/business/recipes/recipes.service';
import { Recipe } from '../core/models/recipe';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';

export class AppStateModel {
    userProfile: User;
    recipes: Recipe[];
    currentRecipe: Recipe;
    totalRecipes: number;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        userProfile: null,
        recipes: [],
        totalRecipes: 0,
        currentRecipe: null
    }
})

export class AppState {

    constructor(
        private recipeService: RecipesService,
        private modal: ModalController,
    ) {
    }


    @Selector()
    static getUserProfile(state: AppStateModel) {
        return state.userProfile;
    }

    @Selector()
    static getRecipes(state: AppStateModel) {
        return state.recipes;
    }

    @Selector()
    static getRecipe(state: AppStateModel) {
        return state.currentRecipe;
    }

    @Selector()
    static getTotalRecipes(state: AppStateModel) {
        return state.totalRecipes;
    }

    @Action(SetUserData)
    setUserData(ctx: StateContext<AppStateModel>, { userData }: SetUserData) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            userProfile: userData
        });
    }

    @Action(ClearUserData)
    clearUserData(ctx: StateContext<AppStateModel>, { }: ClearUserData) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            userProfile: null
        });
    }

    @Action(GetRecipe)
    getRecipe(ctx: StateContext<AppStateModel>, { recipeId }: GetRecipe) {
        const state = ctx.getState();

        return this.recipeService.getRecipe(recipeId).pipe(map(data => {
            ctx.setState({
                ...state,
                currentRecipe: data,
            });
        }));

    }

    @Action(ClearRecipe)
    clearRecipe(ctx: StateContext<AppStateModel>, { }: ClearRecipe) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            currentRecipe: null
        });
    }

    @Action(GetRecipes)
    getRecipes(ctx: StateContext<AppStateModel>, { }: GetRecipes) {
        const state = ctx.getState();

        return this.recipeService.getRecipes().pipe(map(data => {
            data.recipes.map(r => {
                if (r.creator.displayName === state.userProfile.displayName) {
                    r.creator.displayName = 'You';
                }
            });
            ctx.setState({
                ...state,
                recipes: data.recipes,
                totalRecipes: data.totalRecipes
            });
        }));

    }

    @Action(ClearRecipes)
    clearRecipes(ctx: StateContext<AppStateModel>, { }: ClearRecipes) {
        const state = ctx.getState();
        ctx.setState({
            ...state,
            recipes: []
        });
    }

    @Action(CreateRecipe)
    createRecipe(ctx: StateContext<AppStateModel>, { recipeForm, image, isEdit }: CreateRecipe) {
        return this.recipeService.createRecipe(recipeForm, image, isEdit).pipe(map(recipe => {
            if (isEdit) {
                ctx.dispatch(new GetRecipe(recipeForm.id)).toPromise().then(res => {
                    this.modal.dismiss();
                });
            } else {
                ctx.dispatch(new GetRecipes()).toPromise().then(res => {
                    this.modal.dismiss();
                });
            }
        }));

    }
} 