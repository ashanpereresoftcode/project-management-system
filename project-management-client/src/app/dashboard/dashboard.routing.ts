import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children:
            [
                { path: '', redirectTo: 'home', pathMatch: 'full' },
                { path: 'home', component: HomeComponent, },
                { path: 'project-management', loadChildren: () => import(`./project-management/project-management.module`).then(m => m.ProjectManagementModule) },
                { path: 'skill-assessment', loadChildren: () => import(`./skill-assessment/skill-assessment.module`).then(m => m.SkillAssessmentModule) },
                { path: 'user-management', loadChildren: () => import(`./user-management/user-management.module`).then(m => m.UserManagementModule) },
                { path: '**', redirectTo: 'home' },
            ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class DashboardRoutingModule { }