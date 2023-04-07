import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { QueryDocumentSnapshot } from 'firebase/firestore';

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
  isInfiniteScroll: boolean = true;
  favouriteRecipeList: any[]
  @ViewChild(IonModal) modal: IonModal;
  searchData = {
    name: '',
    chipData : [
      {
        name: 'Breakfast',
        isSelected: false
      },
      {
        name: 'Lunch',
        isSelected: false
      },
      {
        name: 'Dinner',
        isSelected: false
      },
      {
        name: 'Snack',
        isSelected: false
      },
      {
        name: 'Drink',
        isSelected: false
      },
    ]
  }


  // Needed for infinite Scroll
  RECIPE_LIMIT_NUMBER = 5;
  DB_Cursor: QueryDocumentSnapshot<unknown>;
  isAllDataQueried: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private modalCtrl: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
  ) {

  }

  async ngOnInit() {
    this.recipeService.createDailyEatenFood();
    await this.getFavouriteRecipes();
    this.getRecipes();
  }

  onEat(element){
    console.log(element);
    this.recipeService.addFoodToEatenFood(element).then((res)=>{
      if(res){
        this.toastService.showSuccessToast("Successfully eaten your food! :)")
        this.recipeService.eatingObserver$.next({
          calories : element.calories,
          carbohydrates: element.carbohydrates,
          protein: element.carbohydrates,
          total_fat: element.carbohydrates,
        });
      } else {
        this.toastService.showErrorToast("Something went wrong! :(")
      }
    })
  }

  async getRecipes(){
    const result = await this.recipeService.getRecipes(0,this.RECIPE_LIMIT_NUMBER);
    if(result){
      this.resetInfiniteScroll();
      this.recipeList = [];

      result.forEach(docs=>{
        let recipe: any = docs.data()
        recipe.isFavourite = this.isFavourite(recipe);
        this.recipeList.push(recipe);
      })
      this.DB_Cursor = result.docs[result.docs.length-1];
      console.log(this.recipeList);
    }
  }

  async onIonInfinite (ev){
    if(!this.isAllDataQueried){
      const result = await this.recipeService.getRecipes(this.DB_Cursor,this.RECIPE_LIMIT_NUMBER)

      if(result){
        result.forEach(docs => {
          let recipe:any = docs.data();
          recipe.isFavourite = this.isFavourite(recipe);
          this.recipeList.push(recipe)
        });
        this.DB_Cursor = result.docs[result.docs.length-1];
        if(result.docs.length < this.RECIPE_LIMIT_NUMBER) {
          this.isAllDataQueried = true;
        }
      }
    }
    (ev as InfiniteScrollCustomEvent).target.complete();
  }

  private resetInfiniteScroll(){
    this.isAllDataQueried = false;
    this.DB_Cursor = undefined;
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

  async onFilterWillDismiss(event){
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if(event.detail.role === 'cancel'){
      console.log("cancel");
      this.isInfiniteScroll = true;
      this.getRecipes();
    }

    if(ev.detail.role === 'confirm'){
      const searchData = ev.detail.data;
      this.isInfiniteScroll = false;
      console.log(searchData);

      if(this.isSearchFieldsSet(searchData)){
        const result = await this.recipeService.getFilteredRecipes(searchData);
        if(result){
          this.recipeList = [];

          result.forEach(docs=>{
            let recipe: any = docs.data()
            recipe.isFavourite = this.isFavourite(recipe);
            this.recipeList.push(recipe);
          })
          console.log(this.recipeList);
        }
      } else {
        this.isInfiniteScroll = true;
        this.getRecipes();
      }


    }
  }

  private isSearchFieldsSet(searchData){
    let result = false;

    if(searchData.name !== '')
      result = true;
    else {
      searchData.chipData.forEach(chip => {
        if(chip.isSelected){
          result = true;
        }
      });
    }


    return result;
  }

  filterCancel(){
    this.modal.dismiss(null, 'cancel');
  }

  filterConfirm(){
    this.modal.dismiss(this.searchData, 'confirm');
  }

  resetSearch(){
    this.searchData.name='';
    for(let chip of this.searchData.chipData){
      chip.isSelected=false;
    }
  }
}
