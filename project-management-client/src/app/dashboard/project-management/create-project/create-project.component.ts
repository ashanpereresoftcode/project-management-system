import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
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
  projectForm!: FormGroup;

  projectStatus: any[] = [
    { value: 'todo', viewValue: 'Todo' },
    { value: 'in-progress', viewValue: 'In-progress' },
    { value: 'done', viewValue: 'Done' }
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
        // add the service call from here
        const editProjectRef = { isEditMode: true, project: this.project };
        this.toastrService.success('Successfully updated.', 'Success');
        this.projectManagementService.afterSave.emit(editProjectRef);
        this.closeModal();
      } else {
        // add the service call from here
        this.toastrService.success('Successfully saved.', 'Success');
        this.projectManagementService.afterSave.emit(project);
        this.closeModal();
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }

  }

}
