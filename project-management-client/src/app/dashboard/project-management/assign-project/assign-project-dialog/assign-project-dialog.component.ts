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
  isUpdate: boolean = false;
  allocatedProjects: any[] = [];

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
      fromDate: new FormControl(null, Validators.required),
      toDate: new FormControl(null, Validators.required),
      comments: new FormControl(null)
    })
  }

  fetchProjects = () => {
    this.blockUI.start('Fetching ......');
    this.projectManagementService.getAllProjects().subscribe(projectData => {
      if (projectData && projectData.validity) {
        const data = projectData?.result;
        this.setAllocatedProject(data);
        const existingProject = this.data?.assignedProject;
        this.patchForm(existingProject);
      }
      this.blockUI.stop();
    }, error => {
      console.log(error);
      this.blockUI.stop();
    })
  }

  setAllocatedProject = (projectData: any) => {
    if (this.existingAssignedProject) {
      this.projectDetails = projectData;
    } else if (this.selectedUser?.assignedProjects) {
      this.projectDetails = projectData;
      //TODO: CHECK ON THIS LATER.
      // const assignedProjects = this.selectedUser?.assignedProjects.map((x: any) => x.project);
      // this.projectDetails = projectData?.filter(function (leftElement: any) {
      //   return assignedProjects?.filter(function (rightElement: any) {
      //     return rightElement.projectId == leftElement.projectId;
      //   }).length == 0
      // });
    }
  }

  setDialogData = () => {
    this.selectedUser = this.data?.user;
    this.existingAssignedProject = this.data?.assignedProject;
  }

  patchForm = (data: any) => {
    if (data) {
      this.isUpdate = true;
      const patchPayload = {
        project: this.projectDetails.find(x => x._id === data?.project._id),
        userId: data?.userId,
        comments: data?.comments,
        fromDate: data.fromDate,
        toDate: data.toDate,
      }
      this.assignedProjectFormGroup.patchValue(patchPayload);
    }
  }

  onProjectAssign = () => {
    this.blockUI.start('Processing .......');
    if (this.assignedProjectFormGroup.valid) {

      if (this.checkAlreadyProjectAssigned()) {
        this.toastrService.error("Selected project already being assigned for this user.", "Error");
        this.blockUI.stop();
      } else if (this.existingAssignedProject) {
        this.existingAssignedProject.project = (this.assignedProjectFormGroup.get('project')?.value)._id;
        this.existingAssignedProject.userId = this.selectedUser?.userId;
        this.existingAssignedProject.projectAllocation = this.assignedProjectFormGroup.get('projectAllocation')?.value;
        this.existingAssignedProject.comments = this.assignedProjectFormGroup.get('comments')?.value;

        this.projectManagementService.updateAssignedProject(this.existingAssignedProject).subscribe(udpatedResult => {
          if (udpatedResult) {
            this.existingAssignedProject['project'] = this.assignedProjectFormGroup.get('project')?.value;
            this.afterUpdate.emit(this.existingAssignedProject);
            this.toastrService.success('Successfully updated.', "Update");
            this.onClear();
          }
          this.blockUI.stop();
        }, () => {
          this.blockUI.stop();
        })
      } else {
        const payload = {
          project: (this.assignedProjectFormGroup.get('project')?.value)._id,
          userId: this.selectedUser?.userId,
          fromDate: this.assignedProjectFormGroup.get('fromDate')?.value,
          toDate: this.assignedProjectFormGroup.get('toDate')?.value,
          comments: this.assignedProjectFormGroup.get('comments')?.value
        }

        this.projectManagementService.assignProject(payload).subscribe(assignedResult => {
          if (assignedResult) {
            assignedResult['project'] = this.assignedProjectFormGroup.get('project')?.value;
            this.afterSave.emit(assignedResult);
            const assignedProject = assignedResult?.result?.assignmentDetail
            // this.selectedUser['assignedProjects']?.length > 0 ?
            //   this.selectedUser['assignedProjects'].push(assignedProject) :
            //   this.selectedUser['assignedProjects'] = [assignedProject];
            this.toastrService.success('Successfully saved.', "Success");
            this.onClear();
          }
          this.blockUI.stop();
        }, () => {
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

  onClear = () => {
    this.assignedProjectFormGroup.reset({});
  }

  onEdit = (event: any) => {
    this.existingAssignedProject = event;
    this.patchForm(event);
  }

  afterDeletion = (event: any) => {
    this.existingAssignedProject = event;
    this.onClear();
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

}
