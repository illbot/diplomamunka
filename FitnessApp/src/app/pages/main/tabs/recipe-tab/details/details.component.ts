import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {

  recipe:any;

  constructor(
    private route: Router
  ) {
    const state = this.route.getCurrentNavigation().extras.state;
    console.log(state.recipe);
    this.recipe = state.recipe;
  }

  ngOnInit() {}

}
