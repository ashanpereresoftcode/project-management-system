import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailCellRendererComponent } from './user-detail-cell-renderer.component';

describe('UserDetailCellRendererComponent', () => {
  let component: UserDetailCellRendererComponent;
  let fixture: ComponentFixture<UserDetailCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
