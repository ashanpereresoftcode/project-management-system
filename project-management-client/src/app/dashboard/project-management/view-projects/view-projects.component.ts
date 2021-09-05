import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
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
        headerName: 'Project Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'projectCode',
        headerName: 'Project Code',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'projectDescription',
        headerName: 'Project Description',
        width: 120,
        suppressAutoSize: true,
      },
      {
        field: 'projectStatus',
        headerName: 'Project Status',
        suppressAutoSize: true,
        width: 100
      },
      {
        headerName: 'Actions',
        width: 55,
        cellRendererFramework: ProjectActionCellRedererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.rowData =
      [
        {
          projectName: "Sample Project",
          projectCode: "SAMPLE PROJECT",
          projectDescription: "SAMPLE PROJECT",
          projectStatus: "in-progress",
        }
      ]

    this.projectCreateListener();
    this.projectDeleteListener();
  }

  projectCreateListener = () => {
    this.projectSubscriptions.push(this.projectManagementService.afterSave.subscribe(result => {
      if (result) {
        if (result && result.isEditMode) {
          // map function.
        } else {
          this.rowData.push(result);
          this.gridApi.setRowData(this.rowData);
        }
      }
    }))
  }

  projectDeleteListener = () => {
    this.projectSubscriptions.push(this.projectManagementService.afterDelete.subscribe(result => {
      debugger
      if (result) {
        // remove data from the array.
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
