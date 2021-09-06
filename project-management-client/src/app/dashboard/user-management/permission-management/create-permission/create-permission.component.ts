import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../shared/services';
@Component({
  selector: 'app-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss']
})
export class CreatePermissionComponent implements OnInit {

  @Input() permission!: any;
  permissionForm!: FormGroup;

  // projectStatus: any[] = [
  //   { value: 'todo', viewValue: 'Todo' },
  //   { value: 'in-progress', viewValue: 'In-progress' },
  //   { value: 'done', viewValue: 'Done' }
  // ];

  constructor(
    public matDialogRef: MatDialogRef<CreatePermissionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data) {
      this.permission = this.data.permission;
      this.patchForm();
    }
  }

  initializeForm = () => {
    this.permissionForm = new FormGroup({
      permissionName: new FormControl(null, Validators.required),
      permissionCode: new FormControl(null, Validators.required),
      permissionDescription: new FormControl(null,)
    })
  }

  patchForm = () => {
    this.permissionForm.patchValue(this.permission);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  saveUser = () => {
    Object.keys(this.permissionForm.controls).forEach(e => {
      const control = this.permissionForm.get(e);
      control?.markAsTouched();
      control?.updateValueAndValidity({ onlySelf: true });
    });


    if (this.permissionForm.valid) {
      const permission = this.permissionForm.value;

      if (this.permission) {
        this.permission.permissionName = permission.permissionName;
        this.permission.permissionCode = permission.permissionCode;
        this.permission.permissionDescripotion = permission.permissionDescripotion;
        // add the service call from here
        const referrence = { isEditMode: true, permission: this.permission };
        this.toastrService.success('Successfully updated.', 'Success');
        this.authService.onUserAfterSave.emit(referrence);
        this.closeModal();
      } else {
        // add the service call from here
        this.toastrService.success('Successfully saved.', 'Success');
        this.authService.onUserAfterSave.emit(permission);
        this.closeModal();
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }

}
