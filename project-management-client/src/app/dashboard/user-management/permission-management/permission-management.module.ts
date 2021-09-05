import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionManagementComponent } from './permission-management.component';
import { ViewPermissionsComponent } from './view-permissions/view-permissions.component';
import { CreatePermissionComponent } from './create-permission/create-permission.component';
import { PermissionRoutingModule } from './permission-management.routing';

@NgModule({
  declarations: [
    PermissionManagementComponent,
    ViewPermissionsComponent,
    CreatePermissionComponent
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule
  ]
})
export class PermissionManagementModule { }
