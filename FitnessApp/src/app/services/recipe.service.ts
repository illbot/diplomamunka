import { Injectable } from '@angular/core';
import { addDoc, collection, doc, endAt, Firestore, getDocs, limit, orderBy, query, setDoc, startAt, where } from 'firebase/firestore';
import { deleteObject, FirebaseStorage, getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { Recipe, RecipeIngredients } from '../shared/datatype/datatypes';
import { uniqueID } from '../shared/uniqueId';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private db;
  private storage;

  constructor() { }

  setFirestore(firestore: Firestore) {
    this.db = firestore
  }

  setStorage(storage: FirebaseStorage){
    this.storage = storage;
  }

  async saveRecipe(recipe: Recipe){
    try{
      await addDoc(collection(this.db, 'recipes'),
        recipe
      );
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }

  async saveRecipePicture(fileDataUrl) {
   try {
    //TODO
    const filePath = 'images/'+uniqueID()+'.jpg';
    const storageRef = ref(this.storage, filePath);
    await uploadString(storageRef, fileDataUrl, 'data_url')
    return filePath;
   } catch(error) {
    console.error(error);
    return false;
   }
  }

  async getImageUrlFromStorage(filePath:string) {
    try{
      const url = await getDownloadURL(ref(this.storage, filePath));
      return url;
    } catch(error) {
      console.error(error)
      return null;
    }
  }

  async deleteImageFromStorage(filePath:string) {
    try {
      await deleteObject(ref(this.storage,filePath));
      return true;
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  async filterIngredientsFromDb(ingredientName: string): Promise<boolean | Map<string,RecipeIngredients>>{
    let resultList: Map<string,RecipeIngredients> = new Map();
    try {
      const q = query(
        collection(this.db, "foodIngredients"),
        orderBy("name"),
        startAt(ingredientName),
        endAt(ingredientName + '\uf8ff') // magic happens here
      );

      const qSnapshot = await getDocs(q);
      //Will exceed quota fast, never read all documents
      //const qSnapshot = await getDocs(collection(this.db, "foodIngredients"));

      qSnapshot.forEach((doc:any) => {
        resultList.set(doc.id,doc.data())
      });
      return resultList;
    } catch (error) {
      console.error(error)
      return false;
    }
  }

  async getRecipes(){
    let resultList: any[] = [];
    try {
      const qSnapshot = await getDocs(collection(this.db, 'recipes'))
      qSnapshot.forEach(doc => {
        resultList.push(doc.data())
      });
      return resultList;
    } catch (error) {
      console.error(error)
      return resultList;
    }
  }

}
