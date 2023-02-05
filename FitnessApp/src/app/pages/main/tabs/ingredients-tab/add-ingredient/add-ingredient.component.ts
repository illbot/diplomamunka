import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { th } from 'date-fns/locale';
import { IngredientService } from 'src/app/services/ingredient.service';
import { ToastService } from 'src/app/services/toast.service';
import { RecipeIngredients } from 'src/app/shared/datatype/datatypes';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
})
export class AddIngredientComponent implements OnInit {

  ingredient: RecipeIngredients;
  loadingElement: HTMLIonLoadingElement;

  constructor(
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private loadingController: LoadingController,
    private ingredietnService: IngredientService,
  ) {
    this.loadingController.create({
      message: 'Uploading ingredient...'
    }).then(res=> this.loadingElement = res);
  }

  ngOnInit() {
    this.initialiteIngredient();
  }

  initialiteIngredient(){
    this.ingredient = {
      name: "",
      calories: null,
      carbohydrate: null,
      protein: null,
      serving_size: null,
      total_fat: null,
      searchField:[],
      unit: 'g'
    };
  }

  cancel(){
    return this.modalCtrl.dismiss(null, 'cancel')
  }

  confirm() {
    return this.modalCtrl.dismiss('valami', 'confirm');
  }

  segmentChanged(ev){
    this.ingredient.unit = ev.detail.value;
  }

  divideWithServingSize(){
    this.ingredient.total_fat = this.ingredient.total_fat / this.ingredient.serving_size;
    this.ingredient.protein = this.ingredient.protein / this.ingredient.serving_size;
    this.ingredient.carbohydrate = this.ingredient.carbohydrate / this.ingredient.serving_size;
    this.ingredient.calories = this.ingredient.calories / this.ingredient.serving_size;

    this.ingredient.serving_size = 1;
  }

  checkErrors(): boolean{
    if(this.ingredient.name === "" || this.ingredient.name.length > 20 ){
      this.toastService.showErrorToast("Name empty or too long!");
      return false
    }
    if(this.ingredient.calories === 0 || this.ingredient.calories === null){
      this.toastService.showErrorToast("Calories empty!");
      return false
    }
    if(this.ingredient.protein === 0 || this.ingredient.protein === null){
      this.toastService.showErrorToast("Protein empty!");
      return false
    }
    if(this.ingredient.carbohydrate === 0 || this.ingredient.carbohydrate === null){
      this.toastService.showErrorToast("Carbohydrate empty!");
      return false
    }
    if(this.ingredient.total_fat === 0 || this.ingredient.total_fat === null){
      this.toastService.showErrorToast("Total fat empty!");
      return false
    }

    return true;
  }

  createSearchfieldForFirebase(){
    this.ingredient.searchField = Array<string>();
    let nameArray = this.ingredient.name.toLowerCase().trim().split(" ");
    for(let name of nameArray){
      let toSearchField = "";
      for(let letter of name){
        toSearchField = toSearchField+letter;
        this.ingredient.searchField.push(toSearchField);
      }
    }
    let toSearchField = "";
    for(let letter of this.ingredient.name){
      toSearchField = toSearchField+letter;
      this.ingredient.searchField.push(toSearchField);
    }
    this.ingredient.searchField = Array.from(new Set(this.ingredient.searchField));
  }

  async uploadIngredient(){
    const res = await this.ingredietnService.saveIngredient(this.ingredient);
    return res;
  }

  async onUploadIngredient(){
    if(!this.checkErrors())
      return;

    this.loadingElement.present();
    // before upload, need to divide with serving size
    this.divideWithServingSize();

    // create search field
    this.createSearchfieldForFirebase();

    // upload data
    const res = await this.uploadIngredient();
    this.loadingElement.dismiss();

    if(res) {
      this.toastService.showSuccessToast("Ingredient uploaded successfully!");
      this.confirm();
    }
    else {
      this.toastService.showErrorToast("Failed to upload Ingredient!");
    }

    //this.confirm();
  }
}
