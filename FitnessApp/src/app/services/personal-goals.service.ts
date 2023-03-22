import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
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
      return isSavedForStatistics
    } else {
      return false;
    }
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
