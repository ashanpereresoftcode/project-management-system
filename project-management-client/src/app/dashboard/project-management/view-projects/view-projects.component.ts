import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectActionCellRedererComponent } from '../project-action-cell-rederer/project-action-cell-rederer.component';
import { ProjectManagementService } from '../../../shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss']
})
export class ViewProjectsComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs: ColDef[];
  defaultColDef: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  projectSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private projectManagementService: ProjectManagementService) {
    this.columnDefs = [
      {
        field: 'projectName',
        headerName: 'Resource Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'projectCode',
        headerName: 'Resource Code',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'projectDescription',
        headerName: 'Resource Description',
        width: 120,
        suppressAutoSize: true,
      },
      {
        field: 'projectStatus',
        headerName: 'Resource Status',
        suppressAutoSize: true,
        width: 100
      },
      {
        headerName: 'Actions',
        width: 100,
        cellRendererFramework: ProjectActionCellRedererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.projectDataLoad();
    this.projectCreateListener();
    this.projectDeleteListener();
  }

  projectDataLoad = () => {
    this.blockUI.start('Fetching ......');
    this.projectSubscriptions.push(this.projectManagementService.getAllProjects().subscribe(projectData => {
      if (projectData && projectData.validity) {
        this.rowData = projectData.result;
      }
      const t = setTimeout(() => {
        this.blockUI.stop();
        clearTimeout(t)
      }, 200);
    }, error => {
      console.log(error);
      this.blockUI.stop();
    }));
  }

  projectCreateListener = () => {
    this.projectSubscriptions.push(this.projectManagementService.afterSave.subscribe(result => {
      if (result) {
        if (result && result.isEditMode) {
          const index = this.rowData.findIndex(x => x._id === result.project._id);
          this.rowData[index] = result.project;
          this.gridApi.setRowData(this.rowData);
        } else {
          this.rowData.unshift(result);
          this.gridApi.setRowData(this.rowData);
        }
      }
    }))
  }

  projectDeleteListener = () => {
    this.projectSubscriptions.push(this.projectManagementService.afterDelete.subscribe(result => {
      if (result && result.deleted) {
        const id = result.projectIds[0];
        const index = this.rowData.findIndex(x => x._id === id);
        this.rowData.splice(index, 1);
        this.gridApi.setRowData(this.rowData);
      }
    }))
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  openModal = () => {
    this.dialog.open(CreateProjectComponent, {
      width: '50%',
      height: 'auto',
      data: null
    });
  }

  ngOnDestroy() {
    if (this.projectSubscriptions && this.projectSubscriptions.length > 0) {
      this.projectSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
