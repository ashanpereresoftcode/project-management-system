import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
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

  permissionSubscription: Subscription[] = [];

  // projectStatus: any[] = [
  //   { value: 'active', viewValue: 'active' },
  //   { value: 'in-active', viewValue: 'in-active' },
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

        this.permissionSubscription.push(this.authService.updateUserPermission(this.permission).subscribe(serviceRes => {
          if (serviceRes) {
            const referrence = { isEditMode: true, permission: this.permission };
            this.toastrService.success('Successfully updated.', 'Success');
            this.authService.onPermissionAfterSave.emit(referrence);
            this.closeModal();
          }
        }, error => {
          console.log(error);
        }))

      } else {
        this.permissionSubscription.push(this.authService.saveUserPermission(permission).subscribe(servicesRes => {
          if (servicesRes) {
            this.toastrService.success('Successfully saved.', 'Success');
            this.authService.onPermissionAfterSave.emit(servicesRes.result);
            this.closeModal();
          }
        }, e => {
          console.log(e);
        }))

      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }

}
