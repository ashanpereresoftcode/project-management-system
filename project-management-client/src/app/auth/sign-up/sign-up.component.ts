import { Component, OnInit, Inject, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @Input() user!: any;
  userForm!: FormGroup;

  constructor(
    public matDialogRef: MatDialogRef<SignUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    if (this.data) {
      this.user = this.data.user;
      this.patchUserForm();
    } else {
      this.userForm.get('password')?.setValidators(Validators.required);
    }
  }

  initializeForm = () => {
    this.userForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      middleName: new FormControl(null),
      userEmail: new FormControl(null, Validators.required),
      password: new FormControl(null),
      contact: new FormControl(null, Validators.required),
      userAddress: new FormControl(null),
      nic: new FormControl(null),
      passportId: new FormControl(null),
      roles: new FormControl(null),
      profilePic: new FormControl(null)
    })
  }

  patchUserForm = () => {
    this.userForm.patchValue(this.user);
  }

  closeModal = () => {
    this.matDialogRef.close();
  }

  saveUser = () => {
    Object.keys(this.userForm.controls).forEach(e => {
      const control = this.userForm.get(e);
      control?.markAsTouched();
      control?.updateValueAndValidity({ onlySelf: true });
    });


    if (this.userForm.valid) {
      const user = this.userForm.value;

      if (this.user) {
        this.user.userName = user.userName;
        this.user.firstName = user.firstName;
        this.user.lastName = user.lastName;
        this.user.middleName = user.middleName;
        this.user.userEmail = user.userEmail;
        this.user.contact = user.contact;
        this.user.userAddress = user.userAddress;
        this.user.nic = user.nic;
        this.user.passportId = user.passportId;
        this.user.roles = user.roles;
        this.user.profilePic = user.profilePic;
        // add the service call from here
        const referrence = { isEditMode: true, user: this.user };
        this.toastrService.success('Successfully updated.', 'Success');
        this.authService.onUserAfterSave.emit(referrence);
        this.closeModal();
      } else {
        // add the service call from here
        this.toastrService.success('Successfully saved.', 'Success');
        this.authService.onUserAfterSave.emit(user);
        this.closeModal();
      }
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }
}
