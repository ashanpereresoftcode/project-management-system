import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreatePermissionComponent } from '../../permission-management/create-permission/create-permission.component';
import { AuthService } from '../../../../shared/services';

@Component({
  selector: 'app-permission-cell-renderer',
  templateUrl: './permission-cell-renderer.component.html',
  styleUrls: ['./permission-cell-renderer.component.scss']
})
export class PermissionCellRendererComponent implements OnInit {

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
    this.dialog.open(CreatePermissionComponent, {
      width: '50%',
      height: 'auto',
      data: { permission: this.data }
    });
  }

  deletePermission = () => {
    this.authService.onPermissionAfterDelete.emit(true);
  }
}
