import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSkillsComponent } from './assign-skills.component';

describe('AssignSkillsComponent', () => {
  let component: AssignSkillsComponent;
  let fixture: ComponentFixture<AssignSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSkillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
