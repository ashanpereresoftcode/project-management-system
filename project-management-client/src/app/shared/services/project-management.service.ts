import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

  baseUrl: string = environment.baseUrl;
  private _projects: any;
  private _selectedUser: any;

  afterSave: EventEmitter<any> = new EventEmitter<any>();
  afterDelete: EventEmitter<any> = new EventEmitter<any>();
  afterAssignedProjectDelete: EventEmitter<any> = new EventEmitter<any>();

  set projectInformation(projects: any) {
    this._projects = projects;
  }

  get projectInformation() {
    return this._projects;
  }

  set userInformation(selectedUser: any) {
    this._selectedUser = selectedUser;
  }

  get userInformation() {
    return this._selectedUser;
  }

  constructor(private httpClient: HttpClient) { }

  getAllProjects = (): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/project/get-all`;
    return this.httpClient.get(url);
  }

  getProject = (projectId: string): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/project/${projectId}`;
    return this.httpClient.get(url);
  }

  createProject = (project: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/project/create`;
    return this.httpClient.post(url, project);
  }

  assignProject = (assignedProject: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/project-assignment/create`;
    return this.httpClient.post(url, assignedProject)
  }

  updateProject = (project: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/project/update`;
    return this.httpClient.put(url, project);
  }

  deleteProjects = (projectIds: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/project/delete`;
    return this.httpClient.post(url, projectIds);
  }

  deleteAssignedProjects = (payload: any) => {
    const url: string = `${this.baseUrl}/api/v1/project-assignment/delete`;
    return this.httpClient.post(url, payload);
  }

  updateAssignedProject = (payload: any) => {
    const url: string = `${this.baseUrl}/api/v1/project-assignment/update`;
    return this.httpClient.put(url, payload);
  }

}
