import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, switchMap } from "rxjs/operators";
import { Recipe, RecipeData } from 'src/app/core/models/recipe';
import { HttpClient } from '@angular/common/http';
import { RecipeDTO, RecipeResDTO, RecipeDataDTO } from 'src/app/core/dtos/recipeDTO';
import { environment } from 'src/environments/environment';
import * as automapper from 'automapper-ts';
import { DateService } from '../../misc/date.service';
import * as moment from 'moment';
import { of } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class RecipesWebDataService {

    imagePath: string;

    constructor(private httpClient: HttpClient, private dateService: DateService) {

    }


    getRecipe(recipeID: string): Observable<Recipe> {
        const graphqlQuery = {
            query: `{
                recipe(id: "${recipeID}") {
                        _id
                        title
                        description
                        imageUrl
                        imagePubicId
                        likes {
                            _id
                            recipeId
                            userId
                        }
                        createdAt
                        updatedAt
                        creator {
                            displayName
                            imageUrl
                            _id
                        }
                }
            }
          `};
        return this.httpClient.post<RecipeResDTO>(environment.baseUrl, graphqlQuery)
            .pipe(map(response => {
                automapper
                    .createMap(RecipeDTO, Recipe)
                    .forMember("id", function (opts) {
                        opts.mapFrom("_id")
                    })
                    .forMember("title", function (opts) {
                        opts.mapFrom("title")
                    })
                    .forMember("description", function (opts) {
                        opts.mapFrom("description")
                    })
                    .forMember("imageUrl", function (opts) {
                        opts.mapFrom("imageUrl")
                    })
                    .forMember("likes", function (opts) {
                        opts.mapFrom("likes")
                    })
                    .forMember("createdAt", function (opts) {
                        opts.mapFrom("createdAt")
                    })
                    .forMember("updatedAt", function (opts) {
                        opts.mapFrom("updatedAt")
                    })
                    .forMember("creator", function (opts) {
                        opts.mapFrom("creator")
                    });
                const recipe: Recipe = automapper.map(RecipeDTO, Recipe, response.data.recipe);

                recipe.createdAtToString = this.dateService.formatToFullDate(moment(recipe.createdAt).toDate());
                recipe.updatedAtToString = this.dateService.formatToFullDate(moment(recipe.updatedAt).toDate());
                recipe.timeInterval = moment(moment(recipe.updatedAt).toDate()).fromNow();
                if (recipe.likes) {
                    recipe.likesCount = recipe.likes.length;
                } else {
                    recipe.likesCount = 0;
                }

                return recipe;
            }));
    }

    getRecipes(pageNumber: number, pageSize: number): Observable<RecipeData> {

        const graphqlQuery = {
            query: `{
                recipes(page: ${pageNumber}, perPage: ${pageSize}) {
                    recipes {
                        _id
                        title
                        description
                        imageUrl
                        imagePubicId
                        likes {
                            _id
                            recipeId
                            userId
                        }
                        createdAt
                        updatedAt
                        creator {
                            _id
                            displayName
                            imageUrl
                        }
                    }
                    totalRecipes
                }
            }
          `};
        return this.httpClient.post<RecipeResDTO>(environment.baseUrl, graphqlQuery)
            .pipe(map(response => {
                automapper
                    .createMap(RecipeDataDTO, RecipeData)
                    .forMember("recipes", function (opts) {
                        opts.mapFrom("recipes")
                    })
                    .forMember("totalRecipes", function (opts) {
                        opts.mapFrom("totalRecipes")
                    })

                const recipesData: RecipeData = automapper.map(RecipeDataDTO, RecipeData, response.data.recipes);

                automapper
                    .createMap(RecipeDTO, Recipe)
                    .forMember("id", function (opts) {
                        opts.mapFrom("_id")
                    })
                    .forMember("title", function (opts) {
                        opts.mapFrom("title")
                    })
                    .forMember("description", function (opts) {
                        opts.mapFrom("description")
                    })
                    .forMember("imageUrl", function (opts) {
                        opts.mapFrom("imageUrl")
                    })
                    .forMember("likes", function (opts) {
                        opts.mapFrom("likes")
                    })
                    .forMember("createdAt", function (opts) {
                        opts.mapFrom("createdAt")
                    })
                    .forMember("updatedAt", function (opts) {
                        opts.mapFrom("updatedAt")
                    })
                    .forMember("creator", function (opts) {
                        opts.mapFrom("creator")
                    });
                const recipes: Recipe[] = automapper.map(RecipeDTO, Recipe, recipesData.recipes);
                recipes.forEach(recipe => {
                    recipe.createdAtToString = this.dateService.formatToFullDate(moment(recipe.createdAt).toDate());
                    recipe.updatedAtToString = this.dateService.formatToFullDate(moment(recipe.updatedAt).toDate());
                    recipe.timeInterval = moment(moment(recipe.createdAt).toDate()).fromNow();
                    if (recipe.likes) {
                        recipe.likesCount = recipe.likes.length;
                    } else {
                        recipe.likesCount = 0;
                    }
                    recipe.descriptionPreview = `${recipe.description.slice(0, 100)}...`;
                })
                recipesData.recipes = recipes;

                return recipesData;
            }));
    }

    upload(media): Observable<any> {

        const imageData = new FormData();

        imageData.append('image', media);
        if (!media) {
            return of(null);
        }
        return this.httpClient.post<any>(environment.imageUploadUrl, imageData);
    }

    createRecipe(formData: any, media: File, isEdit: boolean): Observable<boolean> {
        let imageUrl: string;
        let imagePubicId: string;
        return this.upload(media).pipe(
            switchMap(res => {
                if (res) {
                    imageUrl = res.filePath;
                    imagePubicId = res.publicId;
                } else {
                    imageUrl = formData.imageUrl;
                    imagePubicId = formData.publicId;
                }
                let graphqlQuery;
                if (isEdit) {
                    graphqlQuery =
                    {
                        query: `
                        mutation {
                            updateRecipe(id: "${formData.id}", 
                            recipeInput: {
                              title: "${formData.title}", 
                              description: "${formData.description}", 
                              imagePubicId: "${imagePubicId}", 
                              imageUrl: "${imageUrl}"}) {
                                  _id
                                  title
                              }
                          }`
                    };
                } else {
                    graphqlQuery =
                    {
                        query: `
                            mutation {
                                createRecipe(recipeInput: {
                                    title: "${formData.title}", 
                                    description: "${formData.description}", 
                                    imagePubicId: "${imagePubicId}", 
                                    imageUrl: "${imageUrl}"}) {
                                        _id
                                        title
                                    }
                    }`};
                }
                return this.httpClient.post<any>(environment.baseUrl, graphqlQuery);
            })
        );

    }

    deleteRecipe(recipeId: string): Observable<boolean> {

        const graphqlQuery =
        {
            query: `
                mutation {
                    deleteRecipe(id: "${recipeId}")
                }`
        }

        return this.httpClient.post<boolean>(environment.baseUrl, graphqlQuery);
    }

    likeRecipe(recipeId: string, userId: string) {
        const graphqlQuery =
        {
            query: `
                mutation {
                    likeRecipe(recipeId: "${recipeId}", userId: "${userId}") {
                    _id
                    recipeId
                    userId
                    }
                }`
        }

        this.httpClient.post<any>(environment.baseUrl, graphqlQuery).subscribe(res => {
            console.log(res);
        });
    }
}
