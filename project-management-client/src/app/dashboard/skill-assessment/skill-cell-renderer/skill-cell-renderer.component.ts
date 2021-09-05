import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateAssessmentComponent } from '../create-assessment/create-assessment.component';
import { SkillAssignmentComponent } from '../../../shared/shared-components';
import { ProjectManagementService } from '../../../shared/services';

@Component({
  selector: 'app-skill-cell-renderer',
  templateUrl: './skill-cell-renderer.component.html',
  styleUrls: ['./skill-cell-renderer.component.scss']
})
export class SkillCellRendererComponent implements OnInit {

  data: any;

  constructor(public dialog: MatDialog, private projectManagementService: ProjectManagementService) {
  }

  ngOnInit(): void {
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
    this.dialog.open(CreateAssessmentComponent, {
      width: '50%',
      height: 'auto',
      data: { skill: this.data }
    });
  }

  openAssignment = () => {
    this.dialog.open(SkillAssignmentComponent, {
      width: '50%',
      height: 'auto',
      data: {}
    })
  }

  deleteProject = () => {
    this.projectManagementService.afterDelete.emit(true);
  }

}
