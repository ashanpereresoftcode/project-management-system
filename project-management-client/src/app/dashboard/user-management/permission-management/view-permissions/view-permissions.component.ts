import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { CreatePermissionComponent } from '../create-permission/create-permission.component';
import { AuthService } from '../../../../shared/services';
import { PermissionCellRendererComponent } from '../../permission-management/permission-cell-renderer/permission-cell-renderer.component';


@Component({
  selector: 'app-view-permissions',
  templateUrl: './view-permissions.component.html',
  styleUrls: ['./view-permissions.component.scss']
})
export class ViewPermissionsComponent implements OnInit, OnDestroy {

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  permissionSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService) {

    this.columnDefs = [
      {
        field: 'permissionName',
        headerName: 'permission Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'permissionCode',
        headerName: 'permission Code',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'permissionDescription',
        headerName: 'permission Description',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'createdBy',
        headerName: 'Create By',
        width: 120,
        suppressAutoSize: true,
      },
      {
        field: 'createdOn',
        headerName: 'Created On',
        width: 120,
        suppressAutoSize: true,
      },
      {
        headerName: 'Actions',
        width: 100,
        cellRendererFramework: PermissionCellRendererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.loadAllPermissions();
    this.permissionCreateListener();
    this.permissionDeleteListener();
  }

  loadAllPermissions = () => {
    this.permissionSubscriptions.push(this.authService.fetchUserPermission().subscribe((serviceResult: any) => {
      if (serviceResult && serviceResult.result) {
        this.rowData = serviceResult.result;
      }
    }, error => {
      console.log(error);
    }))
  }

  permissionCreateListener = () => {
    this.permissionSubscriptions.push(this.authService.onPermissionAfterSave.subscribe((result: any) => {
      if (result) {
        if (result && result.isEditMode) {
          const index = this.rowData.findIndex(x => x._id === result.permission._id);
          this.rowData[index] = result.user;
          this.gridApi.setRowData(this.rowData);
        } else {
          this.rowData.unshift(result);
          this.gridApi.setRowData(this.rowData);
        }
      }
    }))
  }

  permissionDeleteListener = () => {
    this.permissionSubscriptions.push(this.authService.onPermissionAfterDelete.subscribe((result: any) => {
      if (result) {
        const id = result.permissionIds[0];
        const index = this.rowData.findIndex(x => x._id === id);
        this.rowData.splice(index, 1);
        this.gridApi.setRowData(this.rowData);
      }
    }))
  }


  openModal = () => {
    this.dialog.open(CreatePermissionComponent, {
      width: '60%',
      height: 'auto',
      data: null
    });
  }

  sizeToFit = () => {
    this.gridApi.sizeColumnsToFit();
  }

  onGridReady = (params: any) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.sizeToFit();
  }

  ngOnDestroy = () => {
    if (this.permissionSubscriptions && this.permissionSubscriptions.length > 0) {
      this.permissionSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
