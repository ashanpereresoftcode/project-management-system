import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { ProjectManagementService } from '../../../shared/services';

@Component({
  selector: 'app-project-action-cell-rederer',
  templateUrl: './project-action-cell-rederer.component.html',
  styleUrls: ['./project-action-cell-rederer.component.scss']
})
export class ProjectActionCellRedererComponent implements OnInit, OnDestroy {
  data: any;
  @BlockUI() blockUI!: NgBlockUI;

  projectSubscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private projectManagementService: ProjectManagementService,
    private toastrService: ToastrService) {
  }

  ngOnInit = () => {
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
    this.dialog.open(CreateProjectComponent, {
      width: '50%',
      height: 'auto',
      data: { project: this.data }
    });
  }

  deleteProject = () => {
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
    form.append("projectIds", JSON.stringify(appIds));

    this.projectSubscriptions.push(this.projectManagementService.deleteProjects(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.projectManagementService.afterDelete.emit({ deleted: true, projectIds: appIds });
        this.toastrService.success('Successfully deleted.', 'Success');
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    }));
  }

  ngOnDestroy() {
    if (this.projectSubscriptions && this.projectSubscriptions.length > 0) {
      this.projectSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }

}
