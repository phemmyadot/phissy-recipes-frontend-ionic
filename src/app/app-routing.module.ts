import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/services/misc/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./auth/signup/signup.module').then(m => m.SignupPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
