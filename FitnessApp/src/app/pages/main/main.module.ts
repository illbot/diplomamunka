import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { ProfileComponent } from './tabs/profile/profile.component';
import { MainTabComponent } from './tabs/main-tab/main-tab.component';
import { RecipeTabComponent } from './tabs/recipe-tab/recipe-tab.component';
import { AddRecipeComponent } from './tabs/recipe-tab/add-recipe/add-recipe.component';
import { RecipeCardComponent } from './tabs/recipe-tab/recipe-card/recipe-card.component';
import { IngredientsTabComponent } from './tabs/ingredients-tab/ingredients-tab.component';
import { AddIngredientComponent } from './tabs/ingredients-tab/add-ingredient/add-ingredient.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,

  ],
  declarations: [
    MainPage,
    ProfileComponent,
    MainTabComponent,
    RecipeTabComponent,
    AddRecipeComponent,
    RecipeCardComponent,
    IngredientsTabComponent,
    AddIngredientComponent,
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MainPageModule {}
