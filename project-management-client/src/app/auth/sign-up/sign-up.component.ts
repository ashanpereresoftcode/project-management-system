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


  designations: any[] = [
    { key: 'ASE', viewValue: 'Associate Software Engineer' },
    { key: 'SE', viewValue: 'Software Engineer' },
    { key: 'SSE', viewValue: 'Senior Software Engineer' },
    { key: 'ATL', viewValue: 'Associate Technical Lead' },
    { key: 'TL', viewValue: 'Technical Lead' },
    { key: 'AT', viewValue: 'Architecht' },
    { key: 'PM', viewValue: 'Project Manager' },
  ];


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
      profilePic: new FormControl(null),
      skills: new FormControl(null),
      projectType: new FormControl(null),
      designation: new FormControl(null, Validators.required)
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
      const user = this.userForm.getRawValue();

      let userForm = new FormData();

      userForm.append("profileImage", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVamKPfw0_YElX1zi2NykJl0Ee3zc2wi22fA&usqp=CAU");
      userForm.append("userPayload", JSON.stringify(user));

      this.authService.saveUser(userForm).subscribe(serviceResult => {
        if (serviceResult) {
          this.toastrService.success('Successfully saved.', 'Success');
          this.authService.onUserAfterSave.emit(user);
          this.closeModal();
        }
      }, error => {
        console.log(error);
      })
    } else {
      this.toastrService.error('Please check the form again.', 'Error');
    }
  }
}
