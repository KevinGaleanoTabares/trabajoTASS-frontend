import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictTable } from './conflict-table';

describe('ConflictTable', () => {
  let component: ConflictTable;
  let fixture: ComponentFixture<ConflictTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ConflictTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
