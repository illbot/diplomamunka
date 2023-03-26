import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, QueryConstraint, setDoc, where, } from 'firebase/firestore';
import { Observable, Subject, Subscriber } from 'rxjs';
import { PersonalGoals } from '../shared/datatype/datatypes';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalGoalsService {

  private db;
  constructor(
    private authService:AuthService
  ) { }


  // Publish/Subscribe
  public personalGoalsObserver$: Subject<any> = new Subject();


  setFirestore(firestore: Firestore) {
    this.db = firestore
  }

  private generateDailyWeightID(userId:string, today:string){
    return userId + '__'+ today;
  }

  private async saveCurrentWeightForStatistics(currentWeight){
    const today:string = new Date().toISOString().slice(0, 10);
    const userId = (await this.authService.getUserData()).uid

    const key = this.generateDailyWeightID(userId,today);

    const docRef = doc(this.db, 'userDailyWeight', key);
    let docSnap = await getDoc(docRef);
    try {
      await setDoc(docRef, {
        weight: currentWeight,
        date: today,
        userId: userId
      })
      return true;
    } catch (error) {
      return false;
    }

  }

  async savePersonalGoals(goals: PersonalGoals){
    const result = await this.authService.savePersonalGoals(goals)
    if(result) {
      const isSavedForStatistics = await this.saveCurrentWeightForStatistics(goals.currentWeight);
      this.personalGoalsObserver$.next(true);
      return isSavedForStatistics
    } else {
      return false;
    }
  }

  async getUserDailyWeights(startDateString:string){
    const userId = (await this.authService.getUserData()).uid;
    let result = [];
    //console.log(startDateString);

    //const query = this.db.collection('userDailyWeight').where('date', '>=', startDateString);
    const q = query(collection(this.db, 'userDailyWeight'),
        where("date", '>=', startDateString),
        where("userId", "==", userId)
    )

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc)=>{
      result.push(doc.data());
    })

    return result;
  }

  async getPersonalGoals() {
    let personalGoals = null;
    const userData = await this.authService.getUserData()
    if (userData) {
      const docRef = doc(this.db, "personalGoals", userData.uid)
        const result = await getDoc(docRef);
        if(result.exists()){
          personalGoals = result.data();
        }
    } else {
      personalGoals = null
    }

    return personalGoals;
  }

  async hasPersonalGoals(){
    const goals = await this.getPersonalGoals();
    if(goals) return true;
    else false;
  }
}

