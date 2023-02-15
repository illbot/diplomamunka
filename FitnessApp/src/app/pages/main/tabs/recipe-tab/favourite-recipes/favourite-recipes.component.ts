import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-favourite-recipes',
  templateUrl: './favourite-recipes.component.html',
  styleUrls: ['./favourite-recipes.component.scss'],
})
export class FavouriteRecipesComponent implements OnInit {

  favouriteRecipes: any[]

  constructor(
    private recipeService: RecipeService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getFavouriteRecipes();
  }

  async getFavouriteRecipes(){
    this.favouriteRecipes = await this.recipeService.getFavouriteRecipes();
    console.log(this.favouriteRecipes);
  }

  navigateToDetails(recipe){
    this.router.navigate(['main/recipes/details'], {
      state: {
        recipe: recipe
      }
    })
  }
}
