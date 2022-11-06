import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from 'firebase/firestore';
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
