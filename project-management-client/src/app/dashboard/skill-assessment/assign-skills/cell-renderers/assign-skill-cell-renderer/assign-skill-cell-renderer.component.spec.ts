import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignSkillCellRendererComponent } from './assign-skill-cell-renderer.component';

describe('AssignSkillCellRendererComponent', () => {
  let component: AssignSkillCellRendererComponent;
  let fixture: ComponentFixture<AssignSkillCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignSkillCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignSkillCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
