import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetUserData, ClearUserData } from './app.action';
import { User } from '../core/models/user';

export class AppStateModel {
    userProfile: User;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        userProfile: null
    }
})

export class AppState {


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