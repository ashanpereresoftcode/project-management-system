import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// MATERIAL IMPORTS
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SkillAssessmentComponent } from './skill-assessment.component';
import { ViewAssessmentsComponent } from './view-assessments/view-assessments.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { SkillAssessmentRoutingModule } from './skill-assessment.routing';
import { SharedComponentsModule } from '../../shared/shared-components';
import { SkillCellRendererComponent } from './skill-cell-renderer/skill-cell-renderer.component'

@NgModule({
  declarations: [
    SkillAssessmentComponent,
    ViewAssessmentsComponent,
    CreateAssessmentComponent,
    SkillCellRendererComponent
  ],
  imports: [
    CommonModule,
    SkillAssessmentRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCheckboxModule,
    MatGridListModule,
    MatTooltipModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    SharedComponentsModule
  ]
})

export class SkillAssessmentModule { }
