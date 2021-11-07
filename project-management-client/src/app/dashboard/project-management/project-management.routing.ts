import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { AssignProjectComponent } from './assign-project/assign-project.component';

const routes: Routes = [
    { path: '', redirectTo: 'view-projects', pathMatch: 'full' },
    { path: 'view-projects', component: ViewProjectsComponent, pathMatch: 'full' },
    { path: 'assign-project', component: AssignProjectComponent },
    { path: 'create', component: CreateProjectComponent },
    { path: '**', redirectTo: 'view-projects' },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }
