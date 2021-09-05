import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// MATERIAL IMPORTS
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MenuItemsComponent } from './menu-items/menu-items.component';
import { ProjectAssignmentComponent } from './project-assignment/project-assignment.component';
import { RatingsComponent } from './ratings/ratings.component';
import { SkillAssignmentComponent } from './skill-assignment/skill-assignment.component';

@NgModule({
  declarations: [
    MenuItemsComponent,
    ProjectAssignmentComponent,
    RatingsComponent,
    SkillAssignmentComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatGridListModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  exports: [
    MenuItemsComponent,
    ProjectAssignmentComponent,
    RatingsComponent
  ]
})

export class SharedComponentsModule { }
