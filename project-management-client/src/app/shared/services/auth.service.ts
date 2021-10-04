import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserModel, changePasswordModel, loginUserModel } from '../models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  onUserAfterSave: EventEmitter<any> = new EventEmitter<any>();
  onUserAfterDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

  onRoleAfterSave: EventEmitter<any> = new EventEmitter<any>();
  onRoleAfterDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

  onPermissionAfterSave: EventEmitter<any> = new EventEmitter<any>();
  onPermissionAfterDelete: EventEmitter<boolean> = new EventEmitter<boolean>();

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  saveUser = (payload: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/user/sign-up`;
    return this.http.post(url, payload);
  }

  fetchUsers(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/get-all`;
    return this.http.get(url);
  }

  authenticateUser(user: loginUserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-in`;
    return this.http.post(url, user);
  }

  registerUser(userData: UserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/sign-up`;
    return this.http.post(url, userData)
  }

  resetPassword(userData: changePasswordModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/user-manager/change-password`;
    return this.http.post(url, userData)
  }

  fetchRoleList(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/get-all`;
    return this.http.get(url);
  }

  fetchRole(roleId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/${roleId}`;
    return this.http.get(url)
  }

  fetchUser(userId: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/${userId}`;
    return this.http.get(url)
  }

  addRole(roleData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/create`;
    return this.http.post(url, roleData)
  }

  fetchUserPermission(): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/permission/get-all`;
    return this.http.get(url);
  }

  saveUserPermission(permission: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/permission/create`;
    return this.http.post(url, permission);
  }

  updateUserPermission = (permission: any) => {
    const url: string = `${this.baseUrl}/api/v1/permission/update`;
    return this.http.put(url, permission);
  }

  deleteUserPermission = (permissionIds: any) => {
    const url: string = `${this.baseUrl}/api/v1/permission/delete`;
    return this.http.post(url, permissionIds);
  }

  deleteRoles(roleDeleteForm: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/delete`;
    return this.http.post(url, roleDeleteForm);
  }

  updateRole(roleData: any): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/role/update`;
    return this.http.put(url, roleData)
  }

  deleteUser(userDelete: FormData): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/delete`;
    return this.http.post(url, userDelete);
  }

  updateUser(userData: UserModel): Observable<any> {
    const url: string = `${this.baseUrl}/api/v1/user/update`;
    return this.http.put(url, userData)
  }
}