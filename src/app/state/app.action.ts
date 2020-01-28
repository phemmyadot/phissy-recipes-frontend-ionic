import { User } from '../core/models/user';
import { Recipe } from '../core/models/recipe';

export class SetUserData {
    static readonly type = '[App] SetUserData';

    constructor(public userData: User) { }
}

export class ClearUserData {
    static readonly type = '[App] ClearUserData';
}

export class GetRecipe {
    static readonly type = '[App] GetRecipe';

    constructor(public recipeId: string) { }
}

export class ClearRecipe {
    static readonly type = '[App] ClearRecipe';
}

export class GetRecipes {
    static readonly type = '[App] GetRecipes';
}


export class ClearRecipes {
    static readonly type = '[App] ClearRecipes';
}

export class CreateRecipe {
    static readonly type = '[App] CreateRecipe';

    constructor(public recipeForm: any, public image: any) { }
}
