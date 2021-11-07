import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../../../../shared/services';
import { ProjectAllocation } from '../../../../shared/enums/project-allocation.enum';

@Component({
  selector: 'app-assign-project-dialog',
  templateUrl: './assign-project-dialog.component.html',
  styleUrls: ['./assign-project-dialog.component.scss']
})
export class AssignProjectDialogComponent implements OnInit {

  @Output() afterSave: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  projectDetails: any[] = [];
  assignedProjectFormGroup!: FormGroup;
  projectAllocation = ProjectAllocation;
  selectedUser: any;

  constructor(
    private projectManagementService: ProjectManagementService,
    public matDialogRef: MatDialogRef<AssignProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initilizeFormGroup();
    this.fetchProjects();
    this.setDialogData();
  }

  initilizeFormGroup = () => {
    this.assignedProjectFormGroup = new FormGroup({
      project: new FormControl(null, Validators.required),
      projectAllocation: new FormControl(null, Validators.required),
      comments: new FormControl(null)
    })
  }

  fetchProjects = () => {
    this.blockUI.start('Fetching ......');
    this.projectManagementService.getAllProjects().subscribe(projectData => {
      if (projectData && projectData.validity) {
        this.projectDetails = projectData.result;
      }
      const tempTimeOut = setTimeout(() => {
        this.blockUI.stop();
        clearTimeout(tempTimeOut)
      }, 200);
    }, error => {
      console.log(error);
      this.blockUI.stop();
    })
  }

  setDialogData = () => {
    this.selectedUser = this.data?.user;
  }

  onProjectAssign = () => {
    console.log(this.assignedProjectFormGroup.value);

    if (this.assignedProjectFormGroup.valid) {
      const payload = {
        project: (this.assignedProjectFormGroup.get('project')?.value)._id,
        userId: this.selectedUser?.userId,
        projectAllocation: this.assignedProjectFormGroup.get('projectAllocation')?.value,
        comments: this.assignedProjectFormGroup.get('comments')?.value
      }

      this.projectManagementService.assignProject(payload).subscribe(assignedResult => {
        debugger
      }, error => {
        console.log(error);
      })


    } else {
      this.toastrService.error('Please check the form again', 'Error');
    }

    // const assignedProject = {
    //   project: payload.project,
    //   userId: payload.userId,
    //   projectAllocation: payload.projectAllocation,
    //   comments: payload.comments,
    // }
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

}
