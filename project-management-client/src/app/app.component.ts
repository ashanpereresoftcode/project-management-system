import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUserService } from './shared/services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project-management-client';

  constructor(
    private loggedUserService: LoggedUserService,
    private router: Router) {
  }

  ngOnInit() {
    if (this.loggedUserService.isUserLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else { 
      this.router.navigate(['/auth'])
    }
  }
}
