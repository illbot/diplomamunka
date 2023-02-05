import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera'
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';
import { ToastService } from 'src/app/services/toast.service';
import { Recipe, RecipeIngredients } from 'src/app/shared/datatype/datatypes';
import { uniqueID } from 'src/app/shared/uniqueId';
import {FormControl} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

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
  ingredientList: Map<string,RecipeIngredients>;
  autocompleteSuggestions:any = [];
  loadingElement:HTMLIonLoadingElement;

  calories: number = 0;
  total_fat: number = 0;
  protein: number = 0;
  carbohydrates:number = 0;

  selectOption(e: MatAutocompleteSelectedEvent, ingredient){
    // I need some magic here!!!...
    let item = e.option.value;

    // Set actual ingredient data with selected item from suggestions
    ingredient.name = item.name;
    ingredient.calories = item.calories;
    ingredient.protein = item.protein;
    ingredient.carbohydrate = item.carbohydrate;
    ingredient.total_fat = item.total_fat;
    ingredient.serving_size = item.serving_size;
    ingredient.unit = item.unit;
    ingredient.serving_size = item.serving_size;

    console.log(this.newRecipe.ingredientList);

    //After selected, delete the suggestions
    this.autocompleteSuggestions = [];
  }

  getOptionText(option){
    return option.name
  }

  getIngredienSuggestions(e){
    let searchString = e.target.value.toLowerCase();

    if(searchString.length>=3){
      this.recipeService.filterIngredientsFromDb(searchString).then(res=>{
        this.autocompleteSuggestions=res;
      })
    }
  }

  onServingSizeChange(){
    this.calories = 0;
    this.protein = 0;
    this.carbohydrates = 0;
    this.total_fat = 0;

    this.newRecipe.ingredientList.forEach(ingredient => {
      this.calories += ingredient.serving_size * ingredient.calories;
      this.protein += ingredient.serving_size * ingredient.protein;
      this.carbohydrates += ingredient.serving_size * ingredient.carbohydrate;
      this.total_fat += ingredient.serving_size * ingredient.total_fat;
    });
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
    this.onServingSizeChange();
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

    this.newRecipe.calories = this.calories;
    this.newRecipe.total_fat = this.total_fat;
    this.newRecipe.carbohydrates = this.carbohydrates;
    this.newRecipe.protein = this.protein;
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
