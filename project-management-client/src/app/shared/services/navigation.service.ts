import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NavItem } from '../models/nav-item.model';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  appDrawer: any;
  currentUrl = new BehaviorSubject<string>('');

  navItems: NavItem[] = [
    {
      displayName: 'Dashboard',
      iconName: 'dashboard',
      route: '/',
      children: []
    },
    {
      displayName: 'Project Management',
      iconName: 'manage_accounts',
      children: [
        {
          displayName: 'View Projects',
          iconName: 'subdirectory_arrow_rightz',
          route: '/dashboard/project-management/view-projects',
          children: [],
        }
      ]
    },
    {
      displayName: 'Skill Assessment',
      iconName: 'inventory',
      children: [
        {
          displayName: 'View Skills',
          iconName: 'subdirectory_arrow_rightz',
          route: '/dashboard/skill-assessment/view-assessments',
          children: []
        }
      ]
    },
    {
      displayName: 'User Management',
      iconName: 'person_add',
      children: [
        {
          displayName: 'View Users',
          iconName: 'subdirectory_arrow_rightz',
          route: '/dashboard/user-management/view-users',
          children: []
        },
        {
          displayName: 'View Roles',
          iconName: 'subdirectory_arrow_rightz',
          route: '/dashboard/user-management/permission-module/view-permissions',
          children: []
        },
        {
          displayName: 'View Permissions',
          iconName: 'subdirectory_arrow_rightz',
          route: '/dashboard/user-management/role-module/view-roles',
          children: []
        }
      ]
    }
  ];

  constructor() { }

  getMenuItems = (): NavItem[] => {
    return this.navItems;
  }

  closeNav = () => {
    this.appDrawer.close();
  }

  openNav = () => {
    this.appDrawer.open();
  }
}
