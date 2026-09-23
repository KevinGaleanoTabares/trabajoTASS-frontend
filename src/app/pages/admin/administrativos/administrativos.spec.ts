import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Administrativos } from './administrativos';

describe('Administrativos', () => {
  let component: Administrativos;
  let fixture: ComponentFixture<Administrativos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Administrativos],
    }).compileComponents();

    fixture = TestBed.createComponent(Administrativos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
