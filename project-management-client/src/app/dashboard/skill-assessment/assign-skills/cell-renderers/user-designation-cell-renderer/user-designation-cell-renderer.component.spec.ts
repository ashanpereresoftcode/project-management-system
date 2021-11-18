import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDesignationCellRendererComponent } from './user-designation-cell-renderer.component';

describe('UserDesignationCellRendererComponent', () => {
  let component: UserDesignationCellRendererComponent;
  let fixture: ComponentFixture<UserDesignationCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDesignationCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDesignationCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
