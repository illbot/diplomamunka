import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPageRoutingModule } from './main-routing.module';

import { MainPage } from './main.page';
import { ProfileComponent } from './tabs/profile/profile.component';
import { MainTabComponent } from './tabs/main-tab/main-tab.component';
import { RecipeTabComponent } from './tabs/recipe-tab/recipe-tab.component';

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
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class MainPageModule {}
