import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe, RecipeIngredients } from 'src/app/shared/datatype/datatypes';
import { uniqueID } from 'src/app/shared/uniqueId';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-recipe-tab',
  templateUrl: './recipe-tab.component.html',
  styleUrls: ['./recipe-tab.component.scss'],
})
export class RecipeTabComponent implements OnInit {

  recipeList: any[]

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.getRecipes();
  }

  async getRecipes(){
    const result = await this.recipeService.getRecipes();
    this.recipeList = [];

    for(let recipe of result){
      recipe.pictureUrl = await this.recipeService.getImageUrlFromStorage(recipe.pictureUrl);
      this.recipeList.push(recipe);
    }

    console.log(this.recipeList);
  }

  onIonInfinite (ev){
    this.recipeService.getRecipes().then(async result=>{
      for(let recipe of result){
        recipe.pictureUrl = await this.recipeService.getImageUrlFromStorage(recipe.pictureUrl);
        this.recipeList.push(recipe);
      }
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

  async openModal(){
    const modal = await this.modalCtrl.create({
      component: AddRecipeComponent,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
    if(role ==='confirm') {
      console.log(data);
      this.getRecipes();
    }
  }
}
