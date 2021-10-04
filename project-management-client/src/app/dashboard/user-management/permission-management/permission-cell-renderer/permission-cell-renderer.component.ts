import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreatePermissionComponent } from '../../permission-management/create-permission/create-permission.component';
import { AuthService } from '../../../../shared/services';

@Component({
  selector: 'app-permission-cell-renderer',
  templateUrl: './permission-cell-renderer.component.html',
  styleUrls: ['./permission-cell-renderer.component.scss']
})
export class PermissionCellRendererComponent implements OnInit, OnDestroy {

  data: any;
  @BlockUI() blockUI!: NgBlockUI;
  permSubscriptions: Subscription[] = [];

  constructor(public dialog: MatDialog, private authService: AuthService, private toastrService: ToastrService) {
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
    this.blockUI.start('Deleting....');
    const appIds: string[] = [].concat(this.data._id);
    if (appIds && appIds.length > 0) {
      this.proceedDelete(appIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  proceedDelete = (appIds: string[]) => {
    let form = new FormData();
    form.append("permissionIds", JSON.stringify(appIds));

    this.permSubscriptions.push(this.authService.deleteUserPermission(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        const emittingVal: any = { deleted: true, permissionIds: appIds };
        this.authService.onPermissionAfterDelete.emit(emittingVal);
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  ngOnDestroy() {
    if (this.permSubscriptions && this.permSubscriptions.length > 0) {
      this.permSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
