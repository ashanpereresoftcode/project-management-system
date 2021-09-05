import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillAssignmentComponent } from './skill-assignment.component';

describe('SkillAssignmentComponent', () => {
  let component: SkillAssignmentComponent;
  let fixture: ComponentFixture<SkillAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
