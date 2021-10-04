import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import * as moment from 'moment';

import { CreateUserComponent } from '../create-user/create-user.component';
import { AuthService, FileService } from '../../../shared/services';
import { UserManagementActionCellRendererComponent } from '../cell-renderers/user-management-action-cell-renderer/user-management-action-cell-renderer.component';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.scss']
})
export class ViewUsersComponent implements OnInit, OnDestroy {

  @BlockUI() blockUI!: NgBlockUI;

  gridApi!: GridApi;
  gridColumnApi: any;

  columnDefs!: ColDef[];
  defaultColDef!: ColDef;
  rowData: any[] = [];
  gridOption!: GridOptions;
  userSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private fileService: FileService) {

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
    this.loadUsers();
    this.skillCreateListener();
    this.skillDeleteListener();
  }

  loadUsers = () => {
    this.userSubscriptions.push(this.authService.fetchUsers().subscribe(serviceResult => {
      if (serviceResult && serviceResult.validity) {
        this.rowData = serviceResult.result;
      }
    }, error => {
      console.log(error);
    }));
  }

  skillCreateListener = () => {
    this.userSubscriptions.push(this.authService.onUserAfterSave.subscribe(result => {
      if (result) {
        if (result && result.isEditMode) {
          const index = this.rowData.findIndex(x => x._id === result.user._id);
          this.rowData[index] = result.user;
          this.gridApi.setRowData(this.rowData);
        } else {
          this.rowData.push(result);
          this.gridApi.setRowData(this.rowData);
        }
      }
    }))
  }

  skillDeleteListener = () => {
    this.userSubscriptions.push(this.authService.onUserAfterDelete.subscribe((result: any) => {
      if (result) {
        const id = result.userIds[0];
        const index = this.rowData.findIndex(x => x._id === id);
        this.rowData.splice(index, 1);
        this.gridApi.setRowData(this.rowData);
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

  exportDataToExcel = () => {
    this.fileService.exportAsExcelFile(this.rowData, 'sci-users');
  }

  exportDataToPdf = () => { 
    this.blockUI.start('Exporting Pdf...');
      const userList: any[] = this.rowData.map(x => {
        return {
          firstName: x.firstName.toLowerCase(),
          lastName: x.lastName.toLowerCase(),
          userEmail: x.userEmail.toLowerCase(),
          contact: x.contact.toLowerCase(),
          passportId: x.passportId ? x.passportId : '-',
          middleName: x.middleName ? x.middleName : '-',
          createdOn: moment(x.createdOn).format('YYYY-MM-DD'),
          modifiedOn: x.modifiedOn ? moment(x.modifiedOn).format('YYYY-MM-DD') : "-"
        }
      });
      const headers: any[] = ['firstName', 'lastName', 'userEmail', 'contact', 'passportId', 'middleName', 'createdOn', 'modifiedOn'];
      this.fileService.exportToPDF("sci-user-report", headers, userList, "user-list");
      this.blockUI.stop();
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
    if (this.userSubscriptions && this.userSubscriptions.length > 0) {
      this.userSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
