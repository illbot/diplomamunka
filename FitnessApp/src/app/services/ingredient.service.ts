import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, limit, orderBy, query, QueryDocumentSnapshot, startAfter, startAt } from 'firebase/firestore';
import { RecipeIngredients } from '../shared/datatype/datatypes';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  private db;

  setFirestore(firestore: Firestore) {
    this.db = firestore
  }

  constructor() { }

  async saveIngredient(ingredient: RecipeIngredients){
    try{
      await addDoc(collection(this.db, 'foodIngredients'),
        ingredient
      );
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }

  async getIngredients(startAfterNumber: QueryDocumentSnapshot | number, limitNumber: number){
    console.log(startAfterNumber)
    try {
      let q;
      if(startAfterNumber === 0){
        q = query(
          collection(this.db, 'foodIngredients'),
          orderBy('name'),
          limit(limitNumber)
        );
      } else {
        q = query(
          collection(this.db, 'foodIngredients'),
          orderBy('name'),
          startAfter(startAfterNumber),
          limit(limitNumber)
        );
      }
      const qSnapshot = await getDocs(q);
      return qSnapshot;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
