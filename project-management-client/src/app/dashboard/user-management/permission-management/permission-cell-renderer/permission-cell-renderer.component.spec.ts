import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionCellRendererComponent } from './permission-cell-renderer.component';

describe('PermissionCellRendererComponent', () => {
  let component: PermissionCellRendererComponent;
  let fixture: ComponentFixture<PermissionCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissionCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissionCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
