export interface UserData{
    name:string,
    emailAdress: string,
    password: string,
    passwordAgain: string
}


export interface PersonalGoals{
    userID: string,
    goal: string,
    gender: string,
    birthDate: string,
    currentWeight: number,
    goalWeight: number,
    height: number
}

export interface RecipeIngredients {
  localId: string,
  name: string,
  calories: number,
  carbohydrate: number,
  protein: number,
  serving_size:number,
  total_fat:number,
  unit?: string
}

export interface Recipe {
  name: string,
  category: string,
  ingredientList: any[],
  howToMake: string,
  pictureUrl: string,
  pictureDataUrl?: string,
  uploader: string,
}
