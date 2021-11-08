import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProjectActionComponent } from './assign-project-action.component';

describe('AssignProjectActionComponent', () => {
  let component: AssignProjectActionComponent;
  let fixture: ComponentFixture<AssignProjectActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignProjectActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignProjectActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
