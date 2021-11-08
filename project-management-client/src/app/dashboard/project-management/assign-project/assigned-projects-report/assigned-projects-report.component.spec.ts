import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedProjectsReportComponent } from './assigned-projects-report.component';

describe('AssignedProjectsReportComponent', () => {
  let component: AssignedProjectsReportComponent;
  let fixture: ComponentFixture<AssignedProjectsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedProjectsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedProjectsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
