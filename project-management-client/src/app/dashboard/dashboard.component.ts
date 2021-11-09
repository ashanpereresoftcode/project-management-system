import { Component, OnInit } from '@angular/core';
import { NavItem } from '../shared/models/nav-item.model';
import { NavigationService } from '../shared/services';
import { LoggedUserService } from '../shared/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;
  navigationItems!: NavItem[];

  designations: any[] = [
    { key: 'ASE', viewValue: 'Associate Software Engineer' },
    { key: 'SE', viewValue: 'Software Engineer' },
    { key: 'SSE', viewValue: 'Senior Software Engineer' },
    { key: 'ATL', viewValue: 'Associate Technical Lead' },
    { key: 'TL', viewValue: 'Technical Lead' },
    { key: 'AT', viewValue: 'Architecht' },
    { key: 'PM', viewValue: 'Project Manager' },
  ];


  constructor(private navigationService: NavigationService, private loggedUserService: LoggedUserService) {
  }

  ngOnInit(): void {
    this.user = this.loggedUserService.getUserDetails();
    this.loadMenuItems();
  }

  loadMenuItems = () => {
    this.navigationItems = this.navigationService.getMenuItems();
  }

  loggOut = () => { 
    this.loggedUserService.signOut();
  }

}
