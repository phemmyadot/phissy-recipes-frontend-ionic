import { User } from './user'

export class RecipeData {
    recipes: Recipe[];
    totalRecipes: number;
}
export class Recipe {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    likes: any[];
    comments: any[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
    createdAtToString: string;
    updatedAtToString: string;
    timeInterval: any;
    creator: User;
}