import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ToastService } from 'src/app/services/toast.service';
import { Recipe, RecipeIngredients } from 'src/app/shared/datatype/datatypes';
import { uniqueID } from 'src/app/shared/uniqueId';
import {FormControl} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent implements OnInit, AfterViewInit {

  selectedImageUrl:string = null;
  chipData = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Drink']
  newRecipe: Recipe;
  userId;
  ingredientList: Map<string,RecipeIngredients>
  loadingElement:HTMLIonLoadingElement;
  options: any = [
    {name:'one', value: 1},
    {name:'two', value: 2},
    {name:'three', value: 2}
  ];
  //testUrl: string

  getOptionText(option){
    return option.name
  }

  constructor(
    private authService: AuthService,
    private recipeService: RecipeService,
    private modalCtrl: ModalController,
    private toastServive: ToastService,
    private loadingController: LoadingController,
  ) {
    this.loadingController.create({
      message: 'Uploading recipe...'
    }).then(res=> this.loadingElement = res);
  }

  ngOnInit() {
    this.newRecipe = this.initializeNewRecipe();
    /*this.recipeService.getAllIngredients().then((list)=>{
      if(list) {
        this.ingredientList = <Map<string,RecipeIngredients>>list;
        console.log(this.ingredientList);
      }
      else console.log("Hiba ingredients lekérdezésnél")
    })*/

    // TEST
    this.recipeService.filterIngredientsFromDb("SUBWAY").then((list)=>{
      if(list) {
        this.ingredientList = <Map<string,RecipeIngredients>>list;
        console.log(this.ingredientList);
      }
      else console.log("Hiba ingredients lekérdezésnél")
    })
  }

  async ngAfterViewInit(): Promise<void> {
    const userData = await this.authService.getUserData()
    if(userData) this.userId = userData.uid;
    if(userData){
      this.userId = userData.uid;
      this.newRecipe.uploader = this.userId;
    }
  }

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel')
  }

  confirm() {
    return this.modalCtrl.dismiss('valami', 'confirm');
  }

  initializeNewRecipe(): Recipe{
    let ingredientList = [
      {name: "", localId: uniqueID()}
    ];

    let recipe: Recipe = {
      name: "",
      category: "",
      howToMake: "",
      pictureUrl: "",
      ingredientList: ingredientList,
      uploader: this.userId,
    }

    return recipe;
  }

  async selectAndUploadImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
    //this.newRecipe.pictureUrl = image.dataUrl;
    this.selectedImageUrl = image.dataUrl;
    this.newRecipe
  }

  getImageUrl(filePath){
    this.recipeService.getImageUrlFromStorage(filePath).then((url)=>{
      if(url) this.selectedImageUrl = url;
    })
  }

  deleteIngredientInput(localId: string){
    this.newRecipe.ingredientList = this.newRecipe.ingredientList.filter((ingr)=>ingr.localId !== localId);
  }

  addIngredientInput(){
    this.newRecipe.ingredientList.push({
      localId: uniqueID(),
      name:""
    });
  }

  async onUploadRecipe(){

    //TODO: Check Inputs
    if(!this.checkInputs()) return;

    // Image upload
    this.loadingElement.present();
    if(
      this.selectedImageUrl === null
    ){
      this.toastServive.showErrorToast("You need to upgrade picture!");
      this.loadingElement.dismiss();
      return;
    }

    const imageUrl = await this.uploadImage();
    if(imageUrl){
      this.newRecipe.pictureUrl = imageUrl;
    } else {
      this.toastServive.showErrorToast("Failed to upload picture!");
      this.loadingElement.dismiss();
      return;
    }

    // Upload actual data
    const res = await this.uploadActualData();
    this.loadingElement.dismiss();

    if(res) {
      this.toastServive.showSuccessToast("Recipe uploaded successfully!");
      this.confirm();
    }
    else {
      this.toastServive.showErrorToast("Failed to upload Recipe!");
    }

  }

  checkInputs(): boolean{
    // check each input
    if(this.newRecipe.name === "" || this.newRecipe.name.length===0 ) {
      this.toastServive.showErrorToast("Give name to the recipe!");
      return false
    }
    if(this.newRecipe.category.length === 0){
      this.toastServive.showErrorToast("Select category!");
      return false;
    }
    // Commented out, until ingredient search/filter not working
    /*if(this.newRecipe.ingredientList.length < 2){
      this.toastServive.showErrorToast("Add at least 2 ingredient!");
      return false;
    }*/
    if(this.newRecipe.howToMake.length < 10){
      console.log(this.newRecipe.howToMake)
      this.toastServive.showErrorToast("You need to write how this Recipe can be made!");
      return false;
    }

    return true
  }

  async uploadImage() {
    const res = await this.recipeService.saveRecipePicture(this.selectedImageUrl)
    return res;
  }

  async uploadActualData(){
    const res = await this.recipeService.saveRecipe(this.newRecipe);
    return res;
  }

  async deleteImage() {
    this.selectedImageUrl = null;
  }

}
