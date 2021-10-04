import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../../../shared/services';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  @Input() project!: any;

  @BlockUI() blockUI!: NgBlockUI;
  projectForm!: FormGroup;


  projectStatus: any[] = [
    { value: 'active', viewValue: 'Active' },
    { value: 'in-active', viewValue: 'In-active' },
  ];

  constructor(
    public matDialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private projectManagementService: ProjectManagementService) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data) {
      this.project = this.data.project;
      this.patchProjectForm();
    }
  }

  initializeForm = () => {
    this.projectForm = new FormGroup({
      projectName: new FormControl(null, Validators.required),
      projectCode: new FormControl(null, Validators.required),
      projectDescription: new FormControl(null),
      projectStatus: new FormControl(null, Validators.required),
    })
  }

  patchProjectForm = () => {
    this.projectForm.patchValue(this.project);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  saveProject = () => {
    Object.keys(this.projectForm.controls).forEach(e => {
      const control = this.projectForm.get(e);
      control?.markAsTouched();
      control?.updateValueAndValidity({ onlySelf: true });
    });


    if (this.projectForm.valid) {
      const project = this.projectForm.value;
      if (this.project) {
        this.project.projectName = project.projectName;
        this.project.projectCode = project.projectCode;
        this.project.projectDescription = project.projectDescription;
        this.project.projectStatus = project.projectStatus;

        this.blockUI.start();
        this.projectManagementService.updateProject(this.project).subscribe(serviceResult => {
          if (serviceResult) {
            const editProjectRef = { isEditMode: true, project: this.project };
            this.toastrService.success('Successfully updated.', 'Success');
            this.projectManagementService.afterSave.emit(editProjectRef);
            this.closeModal();
          }
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.blockUI.stop();
        })

      } else {
        this.blockUI.start();
        this.projectManagementService.createProject(project).subscribe(createdResult => {
          if (createdResult) {
            this.toastrService.success('Successfully saved.', 'Success');
            this.projectManagementService.afterSave.emit(project);
            this.closeModal();
          }
          this.blockUI.stop();
        }, error => {
          console.log(error);
          this.blockUI.stop();
        });
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }
}
