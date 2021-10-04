import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignCellRendererComponent } from './project-assign-cell-renderer.component';

describe('ProjectAssignCellRendererComponent', () => {
  let component: ProjectAssignCellRendererComponent;
  let fixture: ComponentFixture<ProjectAssignCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAssignCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
