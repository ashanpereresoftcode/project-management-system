import { Component, OnInit, Inject, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../shared/services';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit, OnDestroy {

  @Input() role!: any;
  roleForm!: FormGroup;
  roleSubscriptions: Subscription[] = [];
  // projectStatus: any[] = [
  //   { value: 'active', viewValue: 'active' },
  //   { value: 'in-active', viewValue: 'in-active' },
  //   { value: 'done', viewValue: 'Done' }
  // ];

  constructor(
    public matDialogRef: MatDialogRef<CreateRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data) {
      this.role = this.data.role;
      this.patchForm();
    }
  }

  initializeForm = () => {
    this.roleForm = new FormGroup({
      roleName: new FormControl(null, Validators.required),
      roleCode: new FormControl(null, Validators.required),
      roleDescription: new FormControl(null,)
    })
  }

  patchForm = () => {
    this.roleForm.patchValue(this.role);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  saveUser = () => {
    Object.keys(this.roleForm.controls).forEach(e => {
      const control = this.roleForm.get(e);
      control?.markAsTouched();
      control?.updateValueAndValidity({ onlySelf: true });
    });


    if (this.roleForm.valid) {
      let role: any = {};
      role["roleCode"] = this.roleForm.get('roleCode')?.value;
      role["roleName"] = this.roleForm.get('roleName')?.value;
      role["roleDescription"] = this.roleForm.get('roleDescription')?.value;
      role["permissions"] = [];

      if (this.role) {
        this.role.roleName = role.roleName;
        this.role.roleCode = role.roleCode;
        this.role.roleDescription = role.roleDescription;
        this.roleSubscriptions.push(this.authService.updateRole(this.role).subscribe(serviceResult => {
          if (serviceResult) {
            const referrence = { isEditMode: true, role: this.role };
            this.toastrService.success('Successfully updated.', 'Success');
            this.authService.onRoleAfterSave.emit(referrence);
            this.closeModal();
          }
        }, error => {
          console.log(error);
        }))
      } else {
        this.roleSubscriptions.push(this.authService.addRole(role).subscribe(serviceResult => {
          if (serviceResult && serviceResult.validity) {
            this.toastrService.success('Successfully saved.', 'Success');
            this.authService.onRoleAfterSave.emit(serviceResult.result);
            this.closeModal();
          }
        }, error => {
          console.log(error);
        }))
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }

  ngOnDestroy() {
    if (this.roleSubscriptions && this.roleSubscriptions.length > 0) {
      this.roleSubscriptions.forEach(s => {
        s.unsubscribe();
      })
    }
  }
}
