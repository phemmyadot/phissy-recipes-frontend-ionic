import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { Recipe } from 'src/app/core/models/recipe';
import { RecipesService } from 'src/app/core/services/business/recipes/recipes.service';
import { User } from 'src/app/core/models/user';
import { AppState } from 'src/app/state/app.state';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateRecipeComponent implements OnInit {

  @Input() recipe: Recipe;
  recipeForm: FormGroup;
  errors = [];
  imagePreview: any = '';
  isEdit: boolean;
  user: User;

  @Select(AppState.getUserProfile) userProfile$: Observable<User>;

  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private recipesService: RecipesService
  ) { }

  ngOnInit() {
    const recipe = this.recipe;

    // recipe.subscribe(recipe => {
    if (recipe) {
      this.isEdit = true;
      this.recipeForm = this.formBuilder.group({
        title: [recipe.title, Validators.required],
        description: [recipe.description, Validators.required],
        image: [null],
        imageUrl: [recipe.imageUrl],
        publicId: [recipe.publicId],
        id: [recipe.id],
      });
    } else {
      this.isEdit = false;
      this.recipeForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        image: [null, Validators.required]
      });
    }
    this.userProfile$.subscribe(user => {
      this.user = user;
    });
    // });
  }

  get form() { return this.recipeForm.controls; }

  closeModal() {
    this.modal.dismiss();
    this.recipeForm.reset();
  }

  ionViewDidLeave() {
    this.recipeForm.reset();
    this.errors = [];
  }

  onImagePicked(event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.recipeForm.patchValue({ image: file });
    if (this.isEdit) {
      this.recipeForm.updateValueAndValidity();
    }
    this.recipeForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onCreate() {
    this.recipesService.createRecipe(this.recipeForm.value, this.recipeForm.value.image, this.isEdit, this.user.displayName);
  }
}
