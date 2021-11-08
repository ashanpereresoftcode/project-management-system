import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProjectCodeComponent } from '../cell-renderers/project-code/project-code.component';
import { ProjectAllocationComponent } from '../cell-renderers/project-allocation/project-allocation.component';
import { ProjectNameComponent } from '../cell-renderers/project-name/project-name.component';
import { ProjectAllocation } from '../../../../shared/enums/project-allocation.enum';
import { FileService } from '../../../../shared/services/file.service';
import * as moment from 'moment';

@Component({
  selector: 'app-assigned-projects-report',
  templateUrl: './assigned-projects-report.component.html',
  styleUrls: ['./assigned-projects-report.component.scss']
})
export class AssignedProjectsReportComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;

  gridApi!: GridApi;
  gridColumnApi: any;
  projectAllocation: any = ProjectAllocation;
  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  user: any;

  constructor(
    public matDialogRef: MatDialogRef<AssignedProjectsReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fileService: FileService
  ) {
    this.columnDefs = [
      {
        headerName: 'Project Name',
        suppressAutoSize: true,
        width: 120,
        cellRendererFramework: ProjectNameComponent
      },
      {
        headerName: 'Project Code',
        suppressAutoSize: true,
        width: 120,
        cellRendererFramework: ProjectCodeComponent
      },
      {
        headerName: 'Project Allocation',
        suppressAutoSize: true,
        width: 120,
        cellRendererFramework: ProjectAllocationComponent
      },
      {
        headerName: 'Comments',
        field: 'comments',
        suppressAutoSize: true,
        width: 120,
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    if (this.data) {
      this.user = this.data?.user;
      this.rowData = this.data?.user?.assignedProjects;
    }
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  generatePdf = () => {
    this.blockUI.start('Exporting Pdf...');
    const pdfData: any[] = this.rowData.map(x => {
      return {
        'Project Name': x?.project?.projectName,
        'Project Code': x?.project?.projectCode,
        'Project Description': x?.project?.projectDescription,
        'Project Allocation': this.projectAllocation[x?.projectAllocation],
        'Comments': x?.comments,
        'Created On': moment(x?.createdOn).format('YYYY-MM-DD'),
      }
    });
    const headers: any[] = ['Project Name', 'Project Code', 'Description', 'Project Allocation', 'Comments', 'Created On'];
    this.fileService.generateReport('Project Allocation', headers, pdfData, "project-allocation-report", 'Project Allocation Report', true);
    this.blockUI.stop();
  }

  getRatingCard = (rate: number): string => {
    let ratingCard: string = "";
    switch (rate) {
      case 0:
        ratingCard = "N/A";
        break;
      case 1:
        ratingCard = "Fundamental Awareness (basic knowledge)";
        break;
      case 2:
        ratingCard = "Novice (limited experience)";
        break;
      case 3:
        ratingCard = "Intermediate (practical application)";
        break;
      case 4:
        ratingCard = "Advanced (applied theory)";
        break;
      case 5:
        ratingCard = "Expert (recognized authority)";
        break;
    }
    return ratingCard;
  }


  closeModal = () => {
    this.matDialogRef.close();
  }
}
