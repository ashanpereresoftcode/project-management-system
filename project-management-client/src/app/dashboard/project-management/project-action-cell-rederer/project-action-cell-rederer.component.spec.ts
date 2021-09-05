import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActionCellRedererComponent } from './project-action-cell-rederer.component';

describe('ProjectActionCellRedererComponent', () => {
  let component: ProjectActionCellRedererComponent;
  let fixture: ComponentFixture<ProjectActionCellRedererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectActionCellRedererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActionCellRedererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
