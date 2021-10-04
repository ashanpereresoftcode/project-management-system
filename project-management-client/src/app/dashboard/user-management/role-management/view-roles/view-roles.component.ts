import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { CreateRoleComponent } from '../create-role/create-role.component';
import { AuthService } from '../../../../shared/services';
import { RoleActionCellRendererComponent } from '../../role-management/role-action-cell-renderer/role-action-cell-renderer.component';


@Component({
  selector: 'app-view-roles',
  templateUrl: './view-roles.component.html',
  styleUrls: ['./view-roles.component.scss']
})
export class ViewRolesComponent implements OnInit, OnDestroy {
  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  roleSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService) {

    this.columnDefs = [
      {
        field: 'roleName',
        headerName: 'Role Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'roleCode',
        headerName: 'Role Code',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'roleDescription',
        headerName: 'Role Description',
        suppressAutoSize: true,
        width: 150
      },
      // {
      //   field: 'createdBy',
      //   headerName: 'Create By',
      //   width: 120,
      //   suppressAutoSize: true,
      // },
      {
        field: 'createdOn',
        headerName: 'Created On',
        width: 120,
        suppressAutoSize: true,
      },
      {
        headerName: 'Actions',
        width: 100,
        cellRendererFramework: RoleActionCellRendererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.loadAllRoles();
    this.roleCreateListener();
    this.roleDeleteListener();
  }

  loadAllRoles = () => {
    this.roleSubscriptions.push(this.authService.fetchRoleList().subscribe(roleResult => {
      if (roleResult && roleResult.validity) {
        this.rowData = roleResult.result;
      }
    }, error => {
      console.log(error);
    }))
  }

  roleCreateListener = () => {
    this.roleSubscriptions.push(this.authService.onRoleAfterSave.subscribe(result => {
      if (result) {
        if (result && result.isEditMode) {
          const index = this.rowData.findIndex(x => x._id === result.role._id);
          this.rowData[index] = result.role;
          this.gridApi.setRowData(this.rowData);
        } else {
          this.rowData.unshift(result);
          this.gridApi.setRowData(this.rowData);
        }
      }
    }))
  }

  roleDeleteListener = () => {
    this.roleSubscriptions.push(this.authService.onRoleAfterDelete.subscribe((result: any) => {
      if (result && result.deleted) {
        const id = result.roleIds[0];
        const index = this.rowData.findIndex(x => x._id === id);
        this.rowData.splice(index, 1);
        this.gridApi.setRowData(this.rowData);
      }
    }))
  }


  openModal = () => {
    this.dialog.open(CreateRoleComponent, {
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
    if (this.roleSubscriptions && this.roleSubscriptions.length > 0) {
      this.roleSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
