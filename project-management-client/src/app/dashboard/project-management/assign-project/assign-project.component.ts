import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { AuthService } from '../../../shared/services';
import { AssignProjectDialogComponent } from './assign-project-dialog/assign-project-dialog.component';
import { ProjectCodeComponent } from './cell-renderers/project-code/project-code.component';
import { ProjectAllocationComponent } from './cell-renderers/project-allocation/project-allocation.component';
import { ProjectNameComponent } from './cell-renderers/project-name/project-name.component';

@Component({
  selector: 'app-assign-project',
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.scss']
})
export class AssignProjectComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;

  projectDetails: any[] = [];

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  users: any[] = [];
  selectedUser: any;

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService
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
      },
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers = () => {
    this.authService.fetchUsers().subscribe(userResult => {
      if (userResult) {
        this.users = userResult.result;
      }
    }, error => {
      console.log(error);
      this.blockUI.stop();
    })
  }

  onGridReady = (params: any) => {
    this.gridApi = params?.api;
    this.gridColumnApi = params?.columnApi;
    this.sizeToFit();
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  onResourceSelection = () => {
    this.rowData = this.selectedUser.assignedProjects;
  }

  openProjectAssignment = () => {
    this.matDialog.open(AssignProjectDialogComponent, {
      width: '60%',
      height: 'auto',
      data: { user: this.selectedUser }
    });

    // TODO: 
    // skillAssignmentRef.componentInstance.afterSkillAssignment.subscribe((res: any) => {
    //   if (res) {
    //     const assignmentDetail = res?.result?.assignmentDetail;
    //     assignmentDetail.skill = res?.assignedSkill?.skill;
    //     this.rowData.push(assignmentDetail);
    //     this.gridApi.setRowData(this.rowData);
    //     console.log(res);
    //   }
    // })
  }

  openProjectAssignmentReport = () => { }


}
