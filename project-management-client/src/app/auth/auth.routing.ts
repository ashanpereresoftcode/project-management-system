import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SignInComponent } from './sign-in/sign-in.component';
import { AuthComponent } from './auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
    {
        path: '', component: AuthComponent, children:
            [
                { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
                { path: 'sign-in', component: SignInComponent },
                { path: 'sign-up', component: SignUpComponent },
                { path: 'reset-password', component: ForgetPasswordComponent },
                { path: '**', redirectTo: '' }
            ]
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
