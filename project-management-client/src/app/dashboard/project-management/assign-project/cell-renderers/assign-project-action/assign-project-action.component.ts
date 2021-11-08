import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProjectManagementService } from '../../../../../shared/services';
import { AssignProjectDialogComponent } from '../../assign-project-dialog/assign-project-dialog.component';

@Component({
  selector: 'app-assign-project-action',
  templateUrl: './assign-project-action.component.html',
  styleUrls: ['./assign-project-action.component.scss']
})
export class AssignProjectActionComponent implements OnInit, OnDestroy {

  data: any;
  @BlockUI() blockUI!: NgBlockUI;

  assignedProjectSubscription!: Subscription;

  constructor(
    private toastrService: ToastrService,
    private projectManagementService: ProjectManagementService,
    private matDialog: MatDialog,
  ) { }

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
    return params?.data;
  }

  deleteAssignedTask = () => {
    this.blockUI.start('Deleting....');
    const appIds: string[] = [].concat(this.data._id);
    if (appIds && appIds.length > 0) {
      this.proceedDelete(appIds);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  proceedDelete = (projectIds: string[]) => {
    let form = new FormData();
    form.append("assignedProjectIds", JSON.stringify(projectIds));
    form.append("userId", JSON.stringify(this.data.userId));

    this.projectManagementService.deleteAssignedProjects(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.toastrService.success('Successfully deleted.', 'Success');
        this.projectManagementService.afterAssignedProjectDelete.emit({ deleted: true, deletedId: projectIds });
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    });
  }

  updateAssignProject = () => {
    const selectedUser = this.projectManagementService.userInformation;
    const projectAssignDialog = this.matDialog.open(AssignProjectDialogComponent, {
      width: '60%',
      height: 'auto',
      data: { user: selectedUser, assignedProject: this.data }
    });

    this.assignedProjectSubscription = projectAssignDialog.componentInstance.afterUpdate.subscribe((res: any) => {
      if (res) {
        this.data = res;
        this.data.project = res?.project;
        this.toastrService.success("Successfully updated.", "Success");
      }
    })
  }

  ngOnDestroy() {
    if (this.assignedProjectSubscription) {
      this.assignedProjectSubscription.unsubscribe();
    }
  }
}
