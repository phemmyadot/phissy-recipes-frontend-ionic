import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';
import { RecipesService } from '../business/recipes/recipes.service';

export class SocketioService {
    socket;
    constructor(private recipesService: RecipesService) {   }
    setupSocketConnection() {
      this.socket = io(environment.host);

        this.socket.on('recipes', data => {
            if (data.action === 'like') {
                this.recipesService.likeSocket(data.recipe, data.status, data.user, data.likeId);
            }
            if (data.action === 'createRecipe') {
                this.recipesService.updateRecipe(data.recipe, 0);
            }
            if (data.action === 'editRecipe') {
                this.recipesService.updateRecipe(data.recipe, 1);
            }
        });
    }
  }