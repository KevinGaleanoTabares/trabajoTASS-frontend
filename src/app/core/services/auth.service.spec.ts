import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthServiceTs } from './auth.service';

describe('AuthService', () => {
  let service: AuthServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(AuthServiceTs);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
