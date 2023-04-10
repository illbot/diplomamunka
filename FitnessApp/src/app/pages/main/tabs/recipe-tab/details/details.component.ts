import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {

  recipe:any;
  imageUrl;

  constructor(
    private route: Router,
    private recipeService: RecipeService,
  ) {
    const state = this.route.getCurrentNavigation().extras.state;
    this.recipe = state.recipe;
  }

  async ngOnInit() {
    this.imageUrl = await this.recipeService.getImageUrlFromStorage(this.recipe.pictureUrl)
  }

}
