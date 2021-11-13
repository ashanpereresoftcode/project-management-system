import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { AuthService, ProjectManagementService } from '../../../shared/services';
import { AssignProjectDialogComponent } from './assign-project-dialog/assign-project-dialog.component';
import { ProjectCodeComponent } from './cell-renderers/project-code/project-code.component';
import { ProjectAllocationComponent } from './cell-renderers/project-allocation/project-allocation.component';
import { ProjectNameComponent } from './cell-renderers/project-name/project-name.component';
import { AssignProjectActionComponent } from './cell-renderers/assign-project-action/assign-project-action.component';
import { AssignedProjectsReportComponent } from './assigned-projects-report/assigned-projects-report.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assign-project',
  templateUrl: './assign-project.component.html',
  styleUrls: ['./assign-project.component.scss']
})
export class AssignProjectComponent implements OnInit, OnDestroy {
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
  subscriptions: Subscription[] = [];

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private projectManagementService: ProjectManagementService
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
      {
        headerName: 'Actions',
        width: 100,
        cellRendererFramework: AssignProjectActionComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.assignedSkillDeletion();
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

  assignedSkillDeletion = () => {
    this.subscriptions.push(this.projectManagementService.afterAssignedProjectDelete.subscribe(res => {
      if (res) {
        const assignedProjects = this.selectedUser.assignedProjects.filter((s: any) => s?._id !== res?.deletedId[0]);
        this.selectedUser.assignedProjects = [...assignedProjects];
        this.rowData = this.selectedUser.assignedProjects;
        this.gridApi.setRowData(this.rowData);
      }
    }))
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
    this.rowData = this.selectedUser?.assignedProjects;
    this.projectManagementService.userInformation = this.selectedUser;
  }

  openProjectAssignment = () => {
    const projectAssignDialog = this.matDialog.open(AssignProjectDialogComponent, {
      width: '80%',
      height: 'auto',
      data: { user: this.selectedUser }
    });

    this.subscriptions.push(
      projectAssignDialog.componentInstance.afterSave.subscribe((res: any) => {
        const assignmentDetail = res?.result?.assignmentDetail;
        assignmentDetail.project = res?.project;
        this.rowData.push(assignmentDetail);
        this.gridApi.setRowData(this.rowData);
      })
    )
  }

  openProjectAssignmentReport = () => {
    this.matDialog.open(AssignedProjectsReportComponent, {
      width: '60%',
      height: 'auto',
      data: { user: this.selectedUser }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions && this.subscriptions.length > 0) {
      this.subscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }

}
