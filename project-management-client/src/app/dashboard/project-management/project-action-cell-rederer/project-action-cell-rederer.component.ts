import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectAssignmentComponent } from '../../../shared/shared-components';
import { ProjectManagementService } from '../../../shared/services';

@Component({
  selector: 'app-project-action-cell-rederer',
  templateUrl: './project-action-cell-rederer.component.html',
  styleUrls: ['./project-action-cell-rederer.component.scss']
})
export class ProjectActionCellRedererComponent implements OnInit {
  data: any;

  constructor(public dialog: MatDialog, private projectManagementService: ProjectManagementService) {
  }

  ngOnInit = () => {
  }

  agInit(params: ICellRendererParams): void {
    if (params && params.data) {
      this.data = params.data;
    }
  }

  refresh(params: ICellRendererParams) {
    this.data = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.value;
  }

  openModal = () => {
    this.dialog.open(CreateProjectComponent, {
      width: '50%',
      height: 'auto',
      data: { project: this.data }
    });
  }

  openAssignment = () => {
    this.dialog.open(ProjectAssignmentComponent, {
      width: '50%',
      height: 'auto',
      data: {}
    })
  }

  deleteProject = () => {
    this.projectManagementService.afterDelete.emit(true);
  }
}
