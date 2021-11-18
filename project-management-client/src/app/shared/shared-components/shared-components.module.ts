import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AgGridModule } from 'ag-grid-angular';
import { NgSelectModule } from '@ng-select/ng-select';

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
import { MatExpansionModule } from '@angular/material/expansion';
import { MenuItemsComponent } from './menu-items/menu-items.component';
import { ProjectAssignmentComponent } from './project-assignment/project-assignment.component';
import { RatingsComponent } from './ratings/ratings.component';
import { SkillRatingCellRendererComponent } from './skill-rating-cell-renderer/skill-rating-cell-renderer.component';
import { ProjectAssignCellRendererComponent } from './project-assign-cell-renderer/project-assign-cell-renderer.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [
    MenuItemsComponent,
    ProjectAssignmentComponent,
    RatingsComponent,
    SkillRatingCellRendererComponent,
    ProjectAssignCellRendererComponent,
  ],
  imports: [
    AgGridModule.withComponents([
      SkillRatingCellRendererComponent,
      ProjectAssignCellRendererComponent,
    ]),
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
    MatAutocompleteModule,
    NgSelectModule,
    MatExpansionModule,
    PerfectScrollbarModule
  ],
  exports: [
    MenuItemsComponent,
    ProjectAssignmentComponent,
    RatingsComponent,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class SharedComponentsModule { }
