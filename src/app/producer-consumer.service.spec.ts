import { TestBed } from '@angular/core/testing';

import { ProducerConsumerService } from './producer-consumer.service';

describe('ProducerConsumerService', () => {
  let service: ProducerConsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProducerConsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
