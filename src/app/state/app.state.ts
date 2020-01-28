import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetUserData, ClearUserData, GetRecipes, CreateRecipe, GetRecipe } from './app.action';
import { User } from '../core/models/user';
import { RecipesService } from '../core/services/business/recipes/recipes.service';
import { Recipe } from '../core/models/recipe';
import { ModalController } from '@ionic/angular';

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

        this.recipeService.getRecipe(recipeId).subscribe(data => {
            ctx.setState({
                ...state,
                currentRecipe: data,
            });
        });

    }

    @Action(GetRecipes)
    getRecipes(ctx: StateContext<AppStateModel>, { }: GetRecipes) {
        const state = ctx.getState();

        this.recipeService.getRecipes().subscribe(data => {
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
        });

    }

    @Action(CreateRecipe)
    createRecipe(ctx: StateContext<AppStateModel>, { recipeForm, image }: CreateRecipe) {
        this.recipeService.createRecipe(recipeForm, image).subscribe(recipe => {
            console.log(recipe);
            ctx.dispatch(new GetRecipes()).toPromise().then(res => {
                this.modal.dismiss();
            });
        });

    }
} 