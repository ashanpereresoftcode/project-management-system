import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillAssessmentService {

  afterSave: EventEmitter<any> = new EventEmitter<any>();
  afterDelete: EventEmitter<any> = new EventEmitter<any>(false);
  afterAssignmentDeletion: EventEmitter<any> = new EventEmitter<any>(false);

  private _skillInfo: any;

  get skillInformation() {
    return this._skillInfo;
  }

  set skillInformation(skill: any) {
    this._skillInfo = skill;
  };

  baseUrl: string = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  deleteAssignedSkill = (payload: any) => {
    const url: string = `${this.baseUrl}/api/v1/skill-assignment/delete`;
    return this.httpClient.post(url, payload);
  }

  getAllSkills = (): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill/get-all`;
    return this.httpClient.get(url);
  }

  getAssignedSkills = (userId: string): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill/by-user-id/${userId}`;
    return this.httpClient.get(url);
  }

  saveAssignedSkill = (payload: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill-assignment/create`;
    return this.httpClient.post(url, payload);
  }

  getSkill = (skillId: string): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill/${skillId}`;
    return this.httpClient.get(url);
  }

  createSkill = (project: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill/create`;
    return this.httpClient.post(url, project);
  }

  updateSkill = (project: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill/update`;
    return this.httpClient.put(url, project);
  }

  deleteSkill = (skillIds: any): Observable<any> => {
    const url: string = `${this.baseUrl}/api/v1/skill/delete`;
    return this.httpClient.post(url, skillIds);
  }
}
