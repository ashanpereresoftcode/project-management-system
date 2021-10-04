import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreateRoleComponent } from '../../role-management/create-role/create-role.component';
import { AuthService } from '../../../../shared/services';

@Component({
  selector: 'app-role-action-cell-renderer',
  templateUrl: './role-action-cell-renderer.component.html',
  styleUrls: ['./role-action-cell-renderer.component.scss']
})
export class RoleActionCellRendererComponent implements OnInit, OnDestroy {
  data: any;
  @BlockUI() blockUI!: NgBlockUI;

  projectSubscriptions: Subscription[] = [];

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
    this.dialog.open(CreateRoleComponent, {
      width: '50%',
      height: 'auto',
      data: { role: this.data }
    });
  }

  deleteRole = () => {
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
    form.append("roleIds", JSON.stringify(appIds));

    this.projectSubscriptions.push(this.authService.deleteRoles(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        const emittingVal: any = { deleted: true, roleIds: appIds };
        this.authService.onRoleAfterDelete.emit(emittingVal);
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  ngOnDestroy(): void {
    if (this.projectSubscriptions && this.projectSubscriptions.length > 0) {
      this.projectSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
