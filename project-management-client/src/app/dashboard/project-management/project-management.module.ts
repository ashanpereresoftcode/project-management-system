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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';

import { ProjectManagementComponent } from './project-management.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectRoutingModule } from './project-management.routing';
import { ProjectActionCellRedererComponent } from './project-action-cell-rederer/project-action-cell-rederer.component';
import { AssignProjectComponent } from './assign-project/assign-project.component';
import { AssignProjectDialogComponent } from './assign-project/assign-project-dialog/assign-project-dialog.component';
import { ProjectNameComponent } from './assign-project/cell-renderers/project-name/project-name.component';
import { ProjectCodeComponent } from './assign-project/cell-renderers/project-code/project-code.component';
import { ProjectAllocationComponent } from './assign-project/cell-renderers/project-allocation/project-allocation.component';
import { AssignProjectActionComponent } from './assign-project/cell-renderers/assign-project-action/assign-project-action.component';
import { AssignedProjectsReportComponent } from './assign-project/assigned-projects-report/assigned-projects-report.component';
import { MatNativeDateModule } from '@angular/material/core';
import { AssigneeCardComponent } from './assign-project/assignee-card/assignee-card.component';

@NgModule({
  declarations: [
    ProjectManagementComponent,
    ViewProjectsComponent,
    CreateProjectComponent,
    ProjectActionCellRedererComponent,
    AssignProjectComponent,
    AssignProjectDialogComponent,
    ProjectNameComponent,
    ProjectCodeComponent,
    ProjectAllocationComponent,
    AssignProjectActionComponent,
    AssignedProjectsReportComponent,
    AssigneeCardComponent,
  ],
  imports: [
    CommonModule,
    ProjectRoutingModule,
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
    AgGridModule.withComponents([
      ProjectActionCellRedererComponent
    ]),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})

export class ProjectManagementModule { }
