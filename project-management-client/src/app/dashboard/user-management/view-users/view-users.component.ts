import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { CreateUserComponent } from '../create-user/create-user.component';
import { AuthService } from '../../../shared/services';
import { UserManagementActionCellRendererComponent } from '../cell-renderers/user-management-action-cell-renderer/user-management-action-cell-renderer.component';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit, OnDestroy {

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  skillSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService) {

    this.columnDefs = [
      {
        field: 'userName',
        headerName: 'User Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'firstName',
        headerName: 'First Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'lastName',
        headerName: 'Last Name',
        suppressAutoSize: true,
        width: 150
      },
      {
        field: 'userEmail',
        headerName: 'Email',
        width: 120,
        suppressAutoSize: true,
      },
      {
        field: 'contact',
        headerName: 'Contact',
        width: 120,
        suppressAutoSize: true,
      },
      {
        headerName: 'Actions',
        width: 100,
        cellRendererFramework: UserManagementActionCellRendererComponent
      }
    ];
    this.defaultColDef = { resizable: true };
  }

  ngOnInit(): void {
    this.rowData =
      [
        {
          userName: "AshanPerera@@1",
          firstName: "Ashan",
          lastName: "Perera",
          userEmail: "AshanPerera@gmail.com",
          contact: "711071588",
        },
        {
          userName: "AshanPerera@@1",
          firstName: "Ashan",
          lastName: "Perera",
          userEmail: "AshanPerera@gmail.com",
          contact: "711071588",
        },
        {
          userName: "AshanPerera@@1",
          firstName: "Ashan",
          lastName: "Perera",
          userEmail: "AshanPerera@gmail.com",
          contact: "711071588",
        },
        {
          userName: "AshanPerera@@1",
          firstName: "Ashan",
          lastName: "Perera",
          userEmail: "AshanPerera@gmail.com",
          contact: "711071588",
        }
      ]

    this.skillCreateListener();
    this.skillDeleteListener();
  }

  skillCreateListener = () => {
    this.skillSubscriptions.push(this.authService.onUserAfterSave.subscribe(result => {
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

  skillDeleteListener = () => {
    this.skillSubscriptions.push(this.authService.onUserAfterDelete.subscribe(result => {
      debugger
      if (result) {
        // remove data from the array.
      }
    }))
  }

  openModal = () => {
    this.dialog.open(CreateUserComponent, {
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
    if (this.skillSubscriptions && this.skillSubscriptions.length > 0) {
      this.skillSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
