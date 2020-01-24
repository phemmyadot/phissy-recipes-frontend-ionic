import { UserDTO } from './userDTO'

export class RecipeResDTO {
    data: RecipeDataDTO;
}

export class RecipeDataDTO {
    recipes: RecipeDTO[];
    totalRecipes: number;
}
export class RecipeDTO {
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
    creator: UserDTO;
}