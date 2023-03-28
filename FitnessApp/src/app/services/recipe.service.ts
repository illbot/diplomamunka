import { Injectable } from '@angular/core';
import { tr } from 'date-fns/locale';
import { addDoc, collection, doc, endAt, Firestore, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, startAt, where } from 'firebase/firestore';
import { deleteObject, FirebaseStorage, getDownloadURL, ref, uploadBytes, uploadString } from 'firebase/storage';
import { Observable, Subscriber } from 'rxjs';
import { Recipe, RecipeIngredients } from '../shared/datatype/datatypes';
import { uniqueID } from '../shared/uniqueId';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private db;
  private storage;

  // Publish/Subscribe
  public eatingObserver$: Subscriber<any>;
  public eatingObservable = new Observable<any>((observer)=>{
    this.eatingObserver$ = observer;
  });

  constructor(
    private authService: AuthService
  ) {
  }

  private generateDailyEatenFoodId(userId:string,today:string){
    return userId + '__' + today;
  }

  async createDailyEatenFood(){
    const today:string = new Date().toISOString().slice(0, 10);
    const userId = (await this.authService.getUserData()).uid;

    const key = this.generateDailyEatenFoodId(userId,today);

    // get docRef of user
    const docRef = doc(this.db, 'userDailyFood', key);
    let docSnap = await getDoc(docRef);
    // check if daily food exist on user
    if(!docSnap.exists()){
      await setDoc(docRef,{
        food:[]
      });

      docSnap = await getDoc(docRef);
    }
  }

  async addFoodToEatenFood(food: any){
    const today:string = new Date().toISOString().slice(0, 10);
    const userId = (await this.authService.getUserData()).uid;

    const key = this.generateDailyEatenFoodId(userId,today);

    try {
      const docRef = doc(this.db, 'userDailyFood', key);
      let docSnap = await getDoc(docRef);
      let eatenFoods=  docSnap.data().food;

      eatenFoods.push(food);

      await setDoc(docRef, {
        food: eatenFoods
      });
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }

  async getEatenFoodCalories(){
    const today:string = new Date().toISOString().slice(0, 10);
    const userId = (await this.authService.getUserData()).uid;

    const key = this.generateDailyEatenFoodId(userId, today);

    let eatenFoods1 = []
    let result = {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      total_fat: 0,
    };
    try {
      const docRef = doc(this.db, 'userDailyFood', key);
      let docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        eatenFoods1 = <Array<any>> docSnap.data().food;
        if(eatenFoods1){
          eatenFoods1.forEach(element => {
            result.calories += element.calories;
            result.carbohydrates += element.carbohydrates;
            result.protein += element.protein;
            result.total_fat += element.total_fat;
          });
        }
      }

      return result;
    } catch(error) {
      console.error(error);
      return result;
    }
  }

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

  async getRecipes(startAfterNumber: QueryDocumentSnapshot | number, limitNumber: number){
    try {
      let q;
      if(startAfterNumber === 0){
        q = query(
          collection(this.db, 'recipes'),
          orderBy('name'),
          limit(limitNumber)
        );
      } else {
        q = query(
          collection(this.db, 'recipes'),
          orderBy('name'),
          startAfter(startAfterNumber),
          limit(limitNumber)
        );
      }
      const qSnapshot = await getDocs(q);
      return qSnapshot;
    } catch (error) {
      console.error(error)
      return false;
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
