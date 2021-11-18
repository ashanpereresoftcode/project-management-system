import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';

import { TableModule } from 'ngx-easy-table';

import { SkillAssessmentComponent } from './skill-assessment.component';
import { ViewAssessmentsComponent } from './view-assessments/view-assessments.component';
import { CreateAssessmentComponent } from './create-assessment/create-assessment.component';
import { SkillAssessmentRoutingModule } from './skill-assessment.routing';
import { SharedComponentsModule } from '../../shared/shared-components';
import { SkillCellRendererComponent } from './skill-cell-renderer/skill-cell-renderer.component';
import { AssignSkillsComponent } from './assign-skills/assign-skills.component'
import { AssignSkillCellRendererComponent } from './assign-skills/cell-renderers/assign-skill-cell-renderer/assign-skill-cell-renderer.component';
import { AssignSkillActionCellRendererComponent } from './assign-skills/cell-renderers/assign-skill-action-cell-renderer/assign-skill-action-cell-renderer.component';
import { AssignedSkillCardCellRendererComponent } from './assign-skills/cell-renderers/assigned-skill-card-cell-renderer/assigned-skill-card-cell-renderer.component';
import { AssignedSkillReportComponent } from './assign-skills/assigned-skill-report/assigned-skill-report.comopnent';
import { AssignSkillDialogComponent } from './assign-skills/assign-skill-dialog/assign-skill-dialog.component';
import { UserNameCellRendererComponent } from './assign-skills/cell-renderers/user-name-cell-renderer/user-name-cell-renderer.component';
import { UserDesignationCellRendererComponent } from './assign-skills/cell-renderers/user-designation-cell-renderer/user-designation-cell-renderer.component';
import { AssignSkillFormComponent } from './assign-skills/assign-skill-form/assign-skill-form.component';

@NgModule({
  declarations: [
    SkillAssessmentComponent,
    ViewAssessmentsComponent,
    CreateAssessmentComponent,
    SkillCellRendererComponent,
    AssignSkillsComponent,
    AssignSkillCellRendererComponent,
    AssignSkillActionCellRendererComponent,
    AssignedSkillCardCellRendererComponent,
    AssignedSkillReportComponent,
    AssignSkillDialogComponent,
    UserNameCellRendererComponent,
    UserDesignationCellRendererComponent,
    AssignSkillFormComponent,
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
    AgGridModule.withComponents([
      SkillCellRendererComponent,
      AssignSkillCellRendererComponent,
      AssignSkillActionCellRendererComponent,
      AssignedSkillCardCellRendererComponent,
      UserNameCellRendererComponent,
      UserDesignationCellRendererComponent
    ]),
    SharedComponentsModule,
    NgSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    TableModule
  ]
})

export class SkillAssessmentModule { }
