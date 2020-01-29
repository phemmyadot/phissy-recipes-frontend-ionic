import { User } from '../core/models/user';
import { Recipe } from '../core/models/recipe';

export class SetUserData {
    static readonly type = '[App] SetUserData';

    constructor(public userData: User) { }
}

export class ClearUserData {
    static readonly type = '[App] ClearUserData';
}
