import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { UserRoutingModule } from './user-management.routing';

@NgModule({
  declarations: [
    UserManagementComponent,
    ViewUsersComponent,
    CreateUserComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})

export class UserManagementModule { }
