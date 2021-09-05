import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewRolesComponent } from './view-roles/view-roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleManagementComponent } from './role-management.component';
import { RoleRoutingModule } from './role-management.routing';

@NgModule({
  declarations: [
    ViewRolesComponent,
    CreateRoleComponent,
    RoleManagementComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule
  ]
})

export class RoleManagementModule { }
