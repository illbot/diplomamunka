import { Injectable } from '@angular/core';
import { PersonalGoals } from '../shared/datatype/datatypes';

@Injectable({
  providedIn: 'root'
})
export class HealthMetricsService {

  constructor() { }

  private activityLevelConstants = {
    'sedentary': 1.2,
    'lightly-active': 1.375,
    'moderately-active': 1.55,
    'active': 1.725,
    'very-active': 1.9
  }

  calculateCalorieNeeds(personalGoals){
    const BMR = this.calculateBMR(personalGoals);
    const goal = personalGoals.goal;
    let AMR = 0;

    if(personalGoals.activityLevel){
      // This calculation based on the user's activity level
      AMR = BMR * this.activityLevelConstants[personalGoals.activityLevel];
    } else {
      // This calculation assumes that the user do little or no exercise
      AMR = BMR * 1.2
    }


    // Calculate calorie needs based on user's goal
    let calorieNeed = AMR;
    if(goal === 'lose-weight') calorieNeed = calorieNeed * 0.75; // -0.5kg/week
    if(goal === 'gain-weight') calorieNeed = calorieNeed * 1.25;

    return calorieNeed;
  }


  calculateNutrientNeeds(calorieNeed){
    let protein = calorieNeed * 0.25 / 4; // 1 gram of protein = 4 calories
    let carbohydrate = calorieNeed * 0.5 / 4; // 1 gram of carbohydrate = 4 calories
    let fat = calorieNeed * 0.25 / 9; // 1 gram of fat = 9 calories

    return {
      protein: protein,
      carbohydrate: carbohydrate,
      fat: fat
    }
  }

  calculateBMR(personalGoals: PersonalGoals): number {
    let result = 0;

    let gender = personalGoals.gender;
    let weight = personalGoals.currentWeight;
    let height = personalGoals.height;
    let age = this.calculateAge(personalGoals.birthDate);

    if(gender === "man"){
      result = this._calculateBMR(weight,height,age,true);
    } else {
      result = this._calculateBMR(weight,height,age,false);
    }

    return result;
  }

  calculateAge(birthdate) {
    var today = new Date();
    var birthDate = new Date(birthdate);
    var age = today.getFullYear() - birthDate.getFullYear();
    var monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  _calculateBMR(weight: number, height: number, age: number, isMale: boolean): number {
    const s = isMale ? 5 : -161;
    const bmr = 10 * weight + 6.25 * height - 5 * age + s;
    return bmr;
  }
}
