import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { AuthService, TokenManagementService, LoggedUserService } from '../../shared/services';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  authForm!: FormGroup;

  constructor(
    private matDialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private tokenManagementService: TokenManagementService,
    private loggedUserService: LoggedUserService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.isUserAlreadyLoggedIn();
  }

  isUserAlreadyLoggedIn = () => { 
    if (this.loggedUserService.isUserLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else { 
      this.router.navigate(['/auth'])
    }
  }

  initializeForm = () => {
    this.authForm = new FormGroup({
      userNameOrEmail: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    })
  }

  openModal = () => {
    this.matDialog.open(SignUpComponent, {
      width: '60%',
      height: 'auto',
      data: null
    });
  }

  loginToSystem = () => {
    const authResult = this.authForm.value;
    if (this.authForm.valid) {
      this.authService.authenticateUser(authResult).subscribe(serviceResult => {
        if (serviceResult && serviceResult.result) {
          const token = serviceResult.result.accessToken;
          if (token) {
            this.router.navigate(['/dashboard']);
            this.tokenManagementService.storeToken(token);
          }
        }
      }, error => {
        console.log(error);
      })
    }
  }

}
