import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreatePermissionComponent } from './create-permission/create-permission.component';
import { ViewPermissionsComponent } from './view-permissions/view-permissions.component';

const routes: Routes = [
    { path: '', redirectTo: 'view-permissions', pathMatch: 'full' },
    { path: 'view-permissions', component: ViewPermissionsComponent },
    { path: 'create', component: CreatePermissionComponent },
    { path: '**', redirectTo: 'view-permissions' },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PermissionRoutingModule { }
