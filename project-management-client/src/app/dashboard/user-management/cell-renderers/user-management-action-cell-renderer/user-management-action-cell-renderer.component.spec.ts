import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementActionCellRendererComponent } from './user-management-action-cell-renderer.component';

describe('UserManagementActionCellRendererComponent', () => {
  let component: UserManagementActionCellRendererComponent;
  let fixture: ComponentFixture<UserManagementActionCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserManagementActionCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementActionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
