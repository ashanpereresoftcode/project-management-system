import { Component, OnInit, OnDestroy } from '@angular/core';
import { ICellRendererParams } from "ag-grid-community";
import { SkillAssessmentService } from '../../../shared/services';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-assign-skill-action-cell-renderer',
  templateUrl: './assign-skill-action-cell-renderer.component.html',
  styleUrls: ['./assign-skill-action-cell-renderer.component.scss']
})
export class AssignSkillActionCellRendererComponent implements OnInit {

  data: any;
  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private skillAssessmentService: SkillAssessmentService,
    private toastrService: ToastrService) { }

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

  proceedDelete = (appIds: string[]) => {
    let form = new FormData();
    form.append("assignedSkillIds", JSON.stringify(appIds));
    form.append("userId", JSON.stringify(this.data.userId));

    this.skillAssessmentService.deleteAssignedSkill(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.toastrService.success('Successfully deleted.', 'Success');
        this.skillAssessmentService.afterAssignmentDeletion.emit({ deleted: true, deletedId: appIds });
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    });
  }
}
