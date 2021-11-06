import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillReportComponent } from './skill-report.component';

describe('SkillReportComponent', () => {
  let component: SkillReportComponent;
  let fixture: ComponentFixture<SkillReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
