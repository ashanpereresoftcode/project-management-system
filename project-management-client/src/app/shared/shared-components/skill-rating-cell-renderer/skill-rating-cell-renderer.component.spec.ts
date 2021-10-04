import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillRatingCellRendererComponent } from './skill-rating-cell-renderer.component';

describe('SkillRatingCellRendererComponent', () => {
  let component: SkillRatingCellRendererComponent;
  let fixture: ComponentFixture<SkillRatingCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillRatingCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillRatingCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
