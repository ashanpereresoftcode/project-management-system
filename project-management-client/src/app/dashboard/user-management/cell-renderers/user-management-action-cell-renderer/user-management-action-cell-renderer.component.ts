import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from '../../create-user/create-user.component';
import { AuthService } from '../../../../shared/services';

@Component({
  selector: 'app-user-management-action-cell-renderer',
  templateUrl: './user-management-action-cell-renderer.component.html',
  styleUrls: ['./user-management-action-cell-renderer.component.scss']
})
export class UserManagementActionCellRendererComponent implements OnInit {

  data: any;

  constructor(public dialog: MatDialog, private authService: AuthService) {
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
    this.dialog.open(CreateUserComponent, {
      width: '50%',
      height: 'auto',
      data: { user: this.data }
    });
  }

  deleteProject = () => {
    this.authService.onUserAfterDelete.emit(true);
  }
}
