import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNameCellRendererComponent } from './user-name-cell-renderer.component';

describe('UserNameCellRendererComponent', () => {
  let component: UserNameCellRendererComponent;
  let fixture: ComponentFixture<UserNameCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNameCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNameCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
