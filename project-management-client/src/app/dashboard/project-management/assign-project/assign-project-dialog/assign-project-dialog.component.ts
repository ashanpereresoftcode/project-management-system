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
  @Output() afterUpdate: EventEmitter<any> = new EventEmitter<any>();

  @BlockUI() blockUI!: NgBlockUI;

  projectDetails: any[] = [];
  assignedProjectFormGroup!: FormGroup;
  projectAllocation = ProjectAllocation;
  selectedUser: any;
  existingAssignedProject: any;

  constructor(
    private projectManagementService: ProjectManagementService,
    public matDialogRef: MatDialogRef<AssignProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.initilizeFormGroup();
    this.setDialogData();
    this.fetchProjects();
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

        if (this.existingAssignedProject) {
          this.projectDetails = projectData?.result;
        } else if (this.selectedUser?.assignedProjects) {
          const assignedProjects = this.selectedUser?.assignedProjects.map((x: any) => x.project);
          this.projectDetails = projectData?.result?.filter(function (leftElement: any) {
            return assignedProjects?.filter(function (rightElement: any) {
              return rightElement.projectId == leftElement.projectId;
            }).length == 0
          });
        }
        this.patchForm();
      }
      this.blockUI.stop();
    }, error => {
      console.log(error);
      this.blockUI.stop();
    })
  }

  setDialogData = () => {
    this.selectedUser = this.data?.user;
    this.existingAssignedProject = this.data?.assignedProject;
  }

  patchForm = () => {
    const existingProject = this.data?.assignedProject;
    if (existingProject) {
      const patchPayload = {
        project: this.projectDetails.find(x => x._id === existingProject?.project._id),
        userId: existingProject?.userId,
        projectAllocation: existingProject?.projectAllocation,
        comments: existingProject?.comments,
      }
      this.assignedProjectFormGroup.patchValue(patchPayload);
    }
  }

  onProjectAssign = () => {
    this.blockUI.start('Processing .......');
    if (this.assignedProjectFormGroup.valid) {

      if (this.existingAssignedProject) {

        if (this.checkAlreadyProjectAssigned()) {
          this.toastrService.error("Selected project already being assigned for this user.", "Error");
          this.blockUI.stop();
        } else {
          this.existingAssignedProject.project = (this.assignedProjectFormGroup.get('project')?.value)._id;
          this.existingAssignedProject.userId = this.selectedUser?.userId;
          this.existingAssignedProject.projectAllocation = this.assignedProjectFormGroup.get('projectAllocation')?.value;
          this.existingAssignedProject.comments = this.assignedProjectFormGroup.get('comments')?.value;

          this.projectManagementService.updateAssignedProject(this.existingAssignedProject).subscribe(udpatedResult => {
            if (udpatedResult) {
              this.existingAssignedProject['project'] = this.assignedProjectFormGroup.get('project')?.value;
              this.afterUpdate.emit(this.existingAssignedProject);
              this.closeModal();
            }
            this.blockUI.stop();
          }, error => {
            this.blockUI.stop();
          })
        }
      } else {
        const payload = {
          project: (this.assignedProjectFormGroup.get('project')?.value)._id,
          userId: this.selectedUser?.userId,
          projectAllocation: this.assignedProjectFormGroup.get('projectAllocation')?.value,
          comments: this.assignedProjectFormGroup.get('comments')?.value
        }

        this.projectManagementService.assignProject(payload).subscribe(assignedResult => {
          if (assignedResult) {
            assignedResult['project'] = this.assignedProjectFormGroup.get('project')?.value;
            this.afterSave.emit(assignedResult);
            this.closeModal();
          }
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.blockUI.stop();
        })
      }
    } else {
      this.toastrService.error('Please check the form again', 'Error');
      this.blockUI.stop();
    }
  }


  checkAlreadyProjectAssigned = (): boolean => {
    const assignedProjects = this.selectedUser?.assignedProjects.map((x: any) => x.project);
    const project = this.assignedProjectFormGroup?.get('project')?.value;
    return assignedProjects.some((x: any) => x.projectId === project.projectId);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

}
