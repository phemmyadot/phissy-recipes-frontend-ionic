import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { CreateRecipe } from 'src/app/state/app.action';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateRecipeComponent implements OnInit {
  recipeForm: FormGroup;
  errors = [];
  imagePreview: any = '';
  constructor(
    private formBuilder: FormBuilder,
    private modal: ModalController,
    private store: Store
  ) { }

  ngOnInit() {
    this.recipeForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  get form() { return this.recipeForm.controls; }

  closeModal() {
    this.modal.dismiss();
    this.recipeForm.reset();
  }

  onImagePicked(event) {

    const file = (event.target as HTMLInputElement).files[0];
    this.recipeForm.patchValue({ image: file });
    this.recipeForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onCreate() {
    this.store.dispatch(new CreateRecipe(this.recipeForm.value, this.recipeForm.value.image));
  }
}
