import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedSkillCardCellRendererComponent } from './assigned-skill-card-cell-renderer.component';

describe('AssignedSkillCardCellRendererComponent', () => {
  let component: AssignedSkillCardCellRendererComponent;
  let fixture: ComponentFixture<AssignedSkillCardCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedSkillCardCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedSkillCardCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
