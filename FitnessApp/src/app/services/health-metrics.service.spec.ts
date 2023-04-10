import { TestBed } from '@angular/core/testing';

import { HealthMetricsService } from './health-metrics.service';

describe('HealthMetricsService', () => {
  let service: HealthMetricsService;

  let personalGoals = {
    currentWeight: 70,
    height: 170,
    birthDate: '1993-12-12',
    gender: true,
    activityLevel: 'sedentary',
    goal: 'lose-weight'
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthMetricsService);
  });

  it('should calculate calorie needs correctly for "lose-weight" goal and "sedentary" activity level', () => {
    const personalGoals =  {
      currentWeight: 70,
      height: 170,
      birthDate: '1993-12-12',
      gender: 'man',
      activityLevel: 'sedentary',
      goal: 'lose-weight'
    }
    const calorieNeeds = service.calculateCalorieNeeds(personalGoals);
    expect(calorieNeeds).toBeCloseTo(1500, -2);
  });

  it('should calculate calorie needs correctly for "gain-weight" goal and "lightly-active" activity level', () => {
    const personalGoals = {
      currentWeight: 70,
      height: 170,
      birthDate: '1993-12-12',
      gender: 'man',
      activityLevel: 'sedentary',
      goal: 'gain-weight'
    };
    const calorieNeeds = service.calculateCalorieNeeds(personalGoals);
    expect(calorieNeeds).toBeCloseTo(2433.75, -2);
  });

  it('should calculate calorie needs correctly when no activity level is specified', () => {
    const personalGoals = {
      currentWeight: 70,
      height: 170,
      birthDate: '1993-12-12',
      gender: 'man',
      activityLevel: 'sedentary',
      goal: 'mantain'
    };
    const calorieNeeds = service.calculateCalorieNeeds(personalGoals);
    expect(calorieNeeds).toBeCloseTo(1987.2, -2);
  });

  it('should calculate BMR correctly for male', () => {
    const personalGoals = { gender: 'man', currentWeight: 70, height: 170, birthDate: '1990-01-01', userID: '', goal: '', goalWeight: 0 };
    spyOn(service, 'calculateAge').and.returnValue(33);
    const bmr = service.calculateBMR(personalGoals);
    expect(bmr).toBeCloseTo(1600, -2); // BMR for male with weight 70kg, height 170cm, age 33
  });

  it('should calculate BMR correctly for female', () => {
    const personalGoals = { gender: 'woman', currentWeight: 60, height: 160, birthDate: '1995-01-01', userID: '', goal: '', goalWeight: 0  };
    spyOn(service, 'calculateAge').and.returnValue(28);
    const bmr = service.calculateBMR(personalGoals);
    expect(bmr).toBeCloseTo(1300, -2); // BMR for female with weight 60kg, height 160cm, age 28
  });

  it('should calculate BMR correctly for invalid gender', () => {
    const personalGoals = { gender: 'invalid', currentWeight: 50, height: 150, birthDate: '2000-01-01', userID: '', goal: '', goalWeight: 0  };
    spyOn(service, 'calculateAge').and.returnValue(23);
    const bmr = service.calculateBMR(personalGoals);
    expect(bmr).toEqual(0);
  });

  it('should calculate BMR correctly for male', () => {
    const weight = 70;
    const height = 170;
    const age = 33;
    const isMale = true;
    const bmr = service['_calculateBMR'](weight, height, age, isMale);
    expect(bmr).toBeCloseTo(1600, -2); // BMR for male with weight 70kg, height 170cm, age 33
  });

  it('should calculate BMR correctly for female', () => {
    const weight = 60;
    const height = 160;
    const age = 28;
    const isMale = false;
    const bmr = service['_calculateBMR'](weight, height, age, isMale);
    expect(bmr).toBeCloseTo(1300, -2); // BMR for female with weight 60kg, height 160cm, age 28
  });

  it('should calculate BMR correctly for zero weight and height', () => {
    const weight = 0;
    const height = 0;
    const age = 20;
    const isMale = true;
    const bmr = service['_calculateBMR'](weight, height, age, isMale);
    expect(bmr).toBeCloseTo(-100, -2); // BMR for male with weight 0kg, height 0cm, age 20
  });

  it('should calculate BMR correctly for maximum weight and height', () => {
    const weight = Number.MAX_VALUE;
    const height = Number.MAX_VALUE;
    const age = 50;
    const isMale = false;
    const bmr = service['_calculateBMR'](weight, height, age, isMale);
    expect(bmr).toEqual(Number.POSITIVE_INFINITY); // BMR for female with maximum weight and height
  });

});
