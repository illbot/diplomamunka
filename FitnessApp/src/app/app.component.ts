import { Component } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { environment as env } from 'src/environments/environment';
import { AuthService } from './services/auth.service';
import { getAuth } from 'firebase/auth';
import { TranslateService } from '@ngx-translate/core';
import { getFirestore } from 'firebase/firestore';
import { PersonalGoalsService } from './services/personal-goals.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  app: FirebaseApp;
  analytics: Analytics;

  constructor(
    private authService: AuthService,
    private pGoalsService: PersonalGoalsService
    //private translate: TranslateService
  ) {
    this.initFirebase();
    this.initTranslate();
  }

  initFirebase(){
    this.app = initializeApp(env.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.authService.setAuth(getAuth(this.app));
    const firestore = getFirestore(this.app)
    this.authService.setFirestore(firestore);

    this.pGoalsService.setFirestore(firestore);
  }

  initTranslate(){
    //this.translate.addLangs(['en', 'hu']);
    //this.translate.setDefaultLang('en');
    //this.translate.use('en')
  }
}
