import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InfiniteScrollCustomEvent, IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe, RecipeIngredients } from 'src/app/shared/datatype/datatypes';
import { uniqueID } from 'src/app/shared/uniqueId';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

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
  favouriteRecipeList: any[]

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) { }

  async ngOnInit() {
    await this.getFavouriteRecipes();
    this.getRecipes();
  }

  async getRecipes(){
    const result = await this.recipeService.getRecipes();
    this.recipeList = [];

    for(let recipe of result){
      recipe.pictureUrl = await this.recipeService.getImageUrlFromStorage(recipe.pictureUrl);
      recipe.isFavourite = this.isFavourite(recipe);
      this.recipeList.push(recipe);
    }

    console.log(this.recipeList);
  }

  onIonInfinite (ev){
    this.recipeService.getRecipes().then(async result=>{
      result.forEach(recipe => {
        recipe.isFavourite = this.isFavourite(recipe);
        this.recipeList.push(recipe)
      });
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

  navigateToChild(recipe){
    this.router.navigate(['details'], {
      relativeTo: this.route,
      state: {
        recipe: recipe
      }
    })
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

  private isFavourite(recipe: any):boolean{
    const found = this.favouriteRecipeList.find(favRecipe => favRecipe.id === recipe.id);
    return found ? true : false;
  }

  async getFavouriteRecipes() {
    this.favouriteRecipeList = await this.recipeService.getFavouriteRecipes();
  }

  async onFavourite(element){
    if(!element.isFavourite){
      element.isFavourite = !element.isFavourite;
      let result = await this.recipeService.addToFavouriteRecipes(element);
      if(result){
        this.toastService.showSuccessToast("You added a favourite! :)")
      }else{
        this.toastService.showErrorToast("Something went wrong! :(")
      }
    } else {
      element.isFavourite = !element.isFavourite;
      let result = await this.recipeService.deleteFromFavouriteRecipes(element);
      if(!result){
        this.toastService.showErrorToast("Something went wrong! :(")
      }
    }
  }
}
