import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UserHome } from './user-home';

describe('UserHome', () => {
  let component: UserHome;
  let fixture: ComponentFixture<UserHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHome],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UserHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
