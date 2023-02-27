import { TestBed } from '@angular/core/testing';

import { HealthMetricsService } from './health-metrics.service';

describe('HealthMetricsService', () => {
  let service: HealthMetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthMetricsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
