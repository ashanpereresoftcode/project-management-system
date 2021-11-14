import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../../../../shared/services';

@Component({
  selector: 'assignee-card',
  templateUrl: './assignee-card.component.html',
  styleUrls: ['./assignee-card.component.scss']
})
export class AssigneeCardComponent implements OnInit, OnChanges {

  @Input() selectedUser: any;
  @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() afterDeletion: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  constructor(
    private toastrService: ToastrService,
    private projectManagementService: ProjectManagementService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  onEditClick = (selectedProject: any) => {
    this.onEdit.emit(selectedProject);
  }

  onDeleteClick = (selectedProject: any) => {
    this.blockUI.start('Deleting....');
    const appIds: string[] = [].concat(selectedProject._id);
    if (appIds && appIds.length > 0) {
      this.proceedDelete(appIds, selectedProject);
    } else {
      this.toastrService.error("Please select items to delete.", "Error");
      this.blockUI.stop();
    }
  }

  proceedDelete = (projectIds: string[], selectedProject: any) => {
    let form = new FormData();
    form.append("assignedProjectIds", JSON.stringify(projectIds));
    form.append("userId", JSON.stringify(this.selectedUser?.userId));

    this.projectManagementService.deleteAssignedProjects(form).subscribe((deletedResult: any) => {
      if (deletedResult) {
        this.toastrService.success('Successfully deleted.', 'Success');
        this.afterDeletion.emit(selectedProject);
        this.projectManagementService.afterAssignedProjectDelete.emit({ deleted: true, deletedId: projectIds });
      }
      this.blockUI.stop();
    }, () => {
      this.toastrService.error('Failed to delete', 'Error');
      this.blockUI.stop();
    });
  }
}
