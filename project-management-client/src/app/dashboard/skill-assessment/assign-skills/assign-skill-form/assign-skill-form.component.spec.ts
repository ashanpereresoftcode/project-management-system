import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSkillFormComponent } from './assign-skill-form.component';

describe('AssignSkillFormComponent', () => {
  let component: AssignSkillFormComponent;
  let fixture: ComponentFixture<AssignSkillFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSkillFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSkillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
