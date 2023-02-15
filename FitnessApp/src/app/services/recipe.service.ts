import { Injectable } from '@angular/core';
import { addDoc, collection, doc, endAt, Firestore, getDoc, getDocs, limit, orderBy, query, setDoc, startAt, where } from 'firebase/firestore';
import { deleteObject, FirebaseStorage, getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { Recipe, RecipeIngredients } from '../shared/datatype/datatypes';
import { uniqueID } from '../shared/uniqueId';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private db;
  private storage;

  constructor(
    private authService: AuthService
  ) { }

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

  async filterIngredientsFromDb(ingredientName: string): Promise<boolean | Array<RecipeIngredients>>{
    let resultList: Array<RecipeIngredients> = []
    try {
      const q = query(
        collection(this.db, "foodIngredients"),
        where('searchField','array-contains',ingredientName)
      );

      const qSnapshot = await getDocs(q);
      //Will exceed quota fast, never read all documents
      //const qSnapshot = await getDocs(collection(this.db, "foodIngredients"));

      qSnapshot.forEach((doc:any) => {
        resultList.push(doc.data());
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
        let recipe = doc.data()
        recipe.id = doc.id;
        resultList.push(recipe)
      });
      return resultList;
    } catch (error) {
      console.error(error)
      return resultList;
    }
  }

  async getFavouriteRecipes(){
    const userId = (await this.authService.getUserData()).uid;
    let resultList: any[] = [];
    const docRef = doc(this.db, 'favouriteFoods', userId);
    try {
      const doc = await getDoc(docRef)

      const result = doc.data();

      result.favoriteFoods.forEach(food=>{
        resultList.push(food);
      })

      return resultList;
    } catch (error) {
      console.error(error)
      return resultList;
    }
  }

  async addToFavouriteRecipes(recipe: any){
    const userId = (await this.authService.getUserData()).uid;

    const docRef = doc(this.db, "favouriteFoods", userId)
    try{
      const result = await getDoc(docRef);
      if(result.exists()){
        let favouriteFoodObject = result.data();
        favouriteFoodObject.favoriteFoods.push(recipe);
        await setDoc(docRef,favouriteFoodObject);
      } else {
        await setDoc(docRef,{
          userId: userId,
          favoriteFoods: []
        });
      }
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }

  }

  async deleteFromFavouriteRecipes(recipe: any) {
    const userId = (await this.authService.getUserData()).uid;
    const docRef = doc(this.db, "favouriteFoods", userId)

    try{
      const result = await getDoc(docRef);
      if(result.exists()){
        let favouriteFoodObject = result.data();
        favouriteFoodObject.favoriteFoods =
              favouriteFoodObject.favoriteFoods.filter(food => food.id != recipe.id);
        await setDoc(docRef,favouriteFoodObject);
      }
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }

}
