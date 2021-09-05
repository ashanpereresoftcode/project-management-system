import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

  afterSave: EventEmitter<any> = new EventEmitter<any>();
  afterDelete: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() { }
}
