import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FavouriteRecipesComponent } from './favourite-recipes.component';

describe('FavouriteRecipesComponent', () => {
  let component: FavouriteRecipesComponent;
  let fixture: ComponentFixture<FavouriteRecipesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FavouriteRecipesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavouriteRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
