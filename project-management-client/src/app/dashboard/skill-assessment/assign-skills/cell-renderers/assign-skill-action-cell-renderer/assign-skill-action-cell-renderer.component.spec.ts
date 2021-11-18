import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSkillActionCellRendererComponent } from './assign-skill-action-cell-renderer.component';

describe('AssignSkillActionCellRendererComponent', () => {
  let component: AssignSkillActionCellRendererComponent;
  let fixture: ComponentFixture<AssignSkillActionCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSkillActionCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSkillActionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
