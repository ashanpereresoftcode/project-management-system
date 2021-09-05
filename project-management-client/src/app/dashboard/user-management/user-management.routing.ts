import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewUsersComponent } from './view-users/view-users.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
    { path: '', redirectTo: 'view-users', pathMatch: 'full' },
    { path: 'view-users', component: ViewUsersComponent },
    { path: 'create', component: CreateUserComponent },
    { path: 'permission-module', loadChildren: () => import(`./permission-management/permission-management.module`).then(m => m.PermissionManagementModule) },
    { path: 'role-module', loadChildren: () => import(`./role-management/role-management.module`).then(m => m.RoleManagementModule) },
    { path: '**', redirectTo: 'view-users' },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UserRoutingModule { }
