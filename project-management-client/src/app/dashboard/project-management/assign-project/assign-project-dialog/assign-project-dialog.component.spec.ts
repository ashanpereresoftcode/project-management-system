import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProjectDialogComponent } from './assign-project-dialog.component';

describe('AssignProjectDialogComponent', () => {
  let component: AssignProjectDialogComponent;
  let fixture: ComponentFixture<AssignProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignProjectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
