import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillCellRendererComponent } from './skill-cell-renderer.component';

describe('SkillCellRendererComponent', () => {
  let component: SkillCellRendererComponent;
  let fixture: ComponentFixture<SkillCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
