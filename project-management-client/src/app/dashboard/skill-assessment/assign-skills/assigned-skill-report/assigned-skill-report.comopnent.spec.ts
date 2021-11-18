import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedSkillReportComponent } from './assigned-skill-report.comopnent';

describe('SkillReportComponent', () => {
  let component: AssignedSkillReportComponent;
  let fixture: ComponentFixture<AssignedSkillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedSkillReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedSkillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
