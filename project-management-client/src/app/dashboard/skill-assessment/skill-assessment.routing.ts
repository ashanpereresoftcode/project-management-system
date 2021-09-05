import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ViewAssessmentsComponent } from './view-assessments/view-assessments.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';

const routes: Routes = [
    { path: '', redirectTo: 'view-assessments', pathMatch: 'full' },
    { path: 'view-assessments', component: ViewAssessmentsComponent },
    { path: 'create', component: CreateAssessmentComponent },
    { path: '**', redirectTo: 'view-assessments' }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SkillAssessmentRoutingModule { }
