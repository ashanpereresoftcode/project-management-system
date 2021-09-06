import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { CreateRoleComponent } from '../../role-management/create-role/create-role.component';
import { AuthService } from '../../../../shared/services';

@Component({
  selector: 'app-role-action-cell-renderer',
  templateUrl: './role-action-cell-renderer.component.html',
  styleUrls: ['./role-action-cell-renderer.component.scss']
})
export class RoleActionCellRendererComponent implements OnInit {
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
    this.dialog.open(CreateRoleComponent, {
      width: '50%',
      height: 'auto',
      data: { role: this.data }
    });
  }

  deleteProject = () => {
    this.authService.onRoleAfterDelete.emit(true);
  }
}
