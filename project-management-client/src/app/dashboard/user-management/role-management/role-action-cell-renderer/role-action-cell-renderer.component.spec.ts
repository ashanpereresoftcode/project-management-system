import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActionCellRendererComponent } from './role-action-cell-renderer.component';

describe('RoleActionCellRendererComponent', () => {
  let component: RoleActionCellRendererComponent;
  let fixture: ComponentFixture<RoleActionCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleActionCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleActionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
