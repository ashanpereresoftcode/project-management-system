import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewRolesComponent } from './view-roles/view-roles.component';
import { CreateRoleComponent } from './create-role/create-role.component';

const routes: Routes = [
    { path: '', redirectTo: 'view-roles', pathMatch: 'full' },
    { path: 'view-roles', component: ViewRolesComponent },
    { path: 'create', component: CreateRoleComponent },
    { path: '**', redirectTo: 'view-roles' },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class RoleRoutingModule { }
