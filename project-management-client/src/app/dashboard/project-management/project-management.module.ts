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

import { ProjectManagementComponent } from './project-management.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectRoutingModule } from './project-management.routing';
import { ProjectActionCellRedererComponent } from './project-action-cell-rederer/project-action-cell-rederer.component';

@NgModule({
  declarations: [
    ProjectManagementComponent,
    ViewProjectsComponent,
    CreateProjectComponent,
    ProjectActionCellRedererComponent,
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
  ]
})

export class ProjectManagementModule { }
