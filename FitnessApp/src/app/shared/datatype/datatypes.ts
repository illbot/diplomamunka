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
    height: number,
    activityLevel?:string,
}

export interface RecipeIngredients {
  localId?: string,
  name: string,
  calories: number,
  carbohydrate: number,
  protein: number,
  serving_size:number,
  total_fat:number,
  searchField?:string[]
  unit?: string
}

export interface Recipe {
  searchField?: any
  isFavourite?: any
  name: string,
  category: string,
  ingredientList: any[],
  howToMake: string,
  pictureUrl: string,
  pictureDataUrl?: string,
  uploader: string,
  calories?: number,
  total_fat?: number,
  carbohydrates?: number,
  protein?: number,
}
