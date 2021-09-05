import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillAssessmentComponent } from './skill-assessment.component';

describe('SkillAssessmentComponent', () => {
  let component: SkillAssessmentComponent;
  let fixture: ComponentFixture<SkillAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillAssessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
