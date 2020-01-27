import { User } from '../core/models/user';

export class SetUserData {
    static readonly type = '[App] SetUserData';

    constructor(public userData: User) { }
}

export class ClearUserData {
    static readonly type = '[App] ClearUserData';
}
