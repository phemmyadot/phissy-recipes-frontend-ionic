import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetUserData, ClearUserData } from './app.action';
import { User } from '../core/models/user';
import { RecipesService } from '../core/services/business/recipes/recipes.service';
import { Recipe } from '../core/models/recipe';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';

export class AppStateModel {
    userProfile: User;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        userProfile: null,
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

} 