import { UserDTO } from './userDTO'

export class RecipeResDTO {
    data: RecipeDataDTO;
}

export class RecipeDataDTO {
    recipes?: RecipeDTO[];
    recipe?: RecipeDTO;
    totalRecipes: number;
}
export class RecipeDTO {
    _id: string;
    title: string;
    description: string;
    descriptionPreview: string;
    imageUrl: string;
    likes: any[];
    comments: any[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
    creator: UserDTO;
}