import { TestBed } from '@angular/core/testing';

import { SkillAssessmentService } from './skill-assessment.service';

describe('SkillAssessmentService', () => {
  let service: SkillAssessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillAssessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
