import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminHome } from './super-admin-home';

describe('SuperAdminHome', () => {
  let component: SuperAdminHome;
  let fixture: ComponentFixture<SuperAdminHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperAdminHome],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperAdminHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
