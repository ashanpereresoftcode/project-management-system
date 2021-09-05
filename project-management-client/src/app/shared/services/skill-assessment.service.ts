import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillAssessmentService {

  afterSave: EventEmitter<any> = new EventEmitter<any>();
  afterDelete: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() { }
}
