import { Component, OnInit } from '@angular/core';
import { NavItem } from '../shared/models/nav-item.model';
import { NavigationService } from '../shared/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


  navigationItems!: NavItem[];

  constructor(private navigationService: NavigationService) {
  }

  ngOnInit(): void {
    this.loadMenuItems();
  }

  loadMenuItems = () => {
    this.navigationItems = this.navigationService.getMenuItems();
  }

}
