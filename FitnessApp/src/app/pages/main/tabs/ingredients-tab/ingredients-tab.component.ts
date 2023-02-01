import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { IngredientService } from 'src/app/services/ingredient.service';
import { AddIngredientComponent } from './add-ingredient/add-ingredient.component';

@Component({
  selector: 'app-ingredients-tab',
  templateUrl: './ingredients-tab.component.html',
  styleUrls: ['./ingredients-tab.component.scss'],
})
export class IngredientsTabComponent implements OnInit {

  ingredientList: any[];
  LIMIT_NUMBER = 3;
  DB_Cursor: QueryDocumentSnapshot<unknown>;

  constructor(
    private modalCtrl: ModalController,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.ingredientList = [];
    this.getIngredients();
  }

  onIonInfinite(ev) {
    this.ingredientService.getIngredients(this.DB_Cursor,this.LIMIT_NUMBER).then(res => {
      if(res){
        res.forEach(docs=>{
          this.ingredientList.push(docs.data());
        });
        (ev as InfiniteScrollCustomEvent).target.complete()
      }
    });
  }

  async onAddClick(){
    const modal = await this.modalCtrl.create({
      component: AddIngredientComponent,
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
    if(role ==='confirm') {
      /*
      this.ingredientList = [];
      this.DB_Cursor = 0;
      this.getIngredients(this.DB_Cursor);
      */
    }
  }

  async getIngredients() {
    const result = await this.ingredientService.getIngredients(0, this.LIMIT_NUMBER);
    if(result){
      result.forEach(docs=>{
        this.ingredientList.push(docs.data());
      })
      this.DB_Cursor = result.docs[result.docs.length-1]
    }
  }
}
