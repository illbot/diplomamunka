import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/shared/datatype/datatypes';


@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {

  @Input('recipe') recipe: Recipe;
  imageUrl:string;

  @Output('onFavourite') onFavourite: EventEmitter<any> = new EventEmitter();
  @Output('onPicture') onPicture: EventEmitter<any> = new EventEmitter();

  constructor(
    private recipeService: RecipeService,
  ) { }

  async ngOnInit() {
    this.imageUrl = await this.recipeService.getImageUrlFromStorage(this.recipe.pictureUrl)
  }

  onCardClick(){
  }

  onFavouriteClick(){
    this.onFavourite.emit();
  }

  onPictureClick(){
    this.onPicture.emit();
  }
}
