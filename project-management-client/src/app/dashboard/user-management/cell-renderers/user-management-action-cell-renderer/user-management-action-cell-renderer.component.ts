import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreateUserComponent } from '../../create-user/create-user.component';
import { AuthService } from '../../../../shared/services';

@Component({
  selector: 'app-user-management-action-cell-renderer',
  templateUrl: './user-management-action-cell-renderer.component.html',
  styleUrls: ['./user-management-action-cell-renderer.component.scss']
})
export class UserManagementActionCellRendererComponent implements OnInit, OnDestroy {

  data: any;
  @BlockUI() blockUI!: NgBlockUI;

  userSubscriptions: Subscription[] = [];

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
    this.dialog.open(CreateUserComponent, {
      width: '60%',
      height: 'auto',
      data: { user: this.data }
    });
  }

  deleteUser = () => {
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
    form.append("userIds", JSON.stringify(appIds));

    this.userSubscriptions.push(this.authService.deleteUser(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        const emittingVal: any = { deleted: true, userIds: appIds };
        this.authService.onUserAfterDelete.emit(emittingVal);
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  ngOnDestroy() {
    if (this.userSubscriptions && this.userSubscriptions.length > 0) {
      this.userSubscriptions.forEach(e => {
        e.unsubscribe();
      })
    }
  }
}
