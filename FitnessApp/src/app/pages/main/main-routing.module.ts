import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { IngredientsTabComponent } from './tabs/ingredients-tab/ingredients-tab.component';
import { MainTabComponent } from './tabs/main-tab/main-tab.component';
import { ProfileComponent } from './tabs/profile/profile.component';
import { DetailsComponent } from './tabs/recipe-tab/details/details.component';
import { FavouriteRecipesComponent } from './tabs/recipe-tab/favourite-recipes/favourite-recipes.component';
import { RecipeTabComponent } from './tabs/recipe-tab/recipe-tab.component';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path:'recipes',
        component: RecipeTabComponent,
      },
      {
        path:'recipes/details',
        component: DetailsComponent,
      },
      {
        path:'recipes/favourites',
        component: FavouriteRecipesComponent,
      },
      {
        path:'profile',
        component: ProfileComponent
      },
      {
        path:'ingredients',
        component: IngredientsTabComponent
      },
      {
        path:'home',
        component: MainTabComponent
      },
      {
        path: '',
        redirectTo: '/main/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
