import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../shared/services';


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

  @Input() role!: any;
  roleForm!: FormGroup;

  // projectStatus: any[] = [
  //   { value: 'todo', viewValue: 'Todo' },
  //   { value: 'in-progress', viewValue: 'In-progress' },
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
      const role = this.roleForm.value;

      if (this.role) {
        this.role.roleName = role.roleName;
        this.role.roleCode = role.roleCode;
        this.role.roleDescripotion = role.roleDescripotion;
        // add the service call from here
        const referrence = { isEditMode: true, role: this.role };
        this.toastrService.success('Successfully updated.', 'Success');
        this.authService.onUserAfterSave.emit(referrence);
        this.closeModal();
      } else {
        // add the service call from here
        this.toastrService.success('Successfully saved.', 'Success');
        this.authService.onUserAfterSave.emit(role);
        this.closeModal();
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }
}
