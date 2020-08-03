import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './services/authentication.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatApp';
  user: User;
  isChatActive: boolean = false;

  constructor(private authenticationService: AuthenticationService, public router: Router) {
    this.authenticationService.getUserSubject().subscribe(x => this.user = x);
  }

  logout() {
    this.authenticationService.logout();
  }
  toggleChat() {
    this.isChatActive = !this.isChatActive;
  }
}
