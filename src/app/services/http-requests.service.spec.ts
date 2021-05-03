import { TestBed } from '@angular/core/testing';

import { HttpRequestsService } from './http-requests.service';

describe('HttpRequestsService', () => {
  let service: HttpRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
