import { TestBed, inject } from '@angular/core/testing';

import { DataCommonService } from './data-common.service';

describe('DataCommonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataCommonService]
    });
  });

  it('should be created', inject([DataCommonService], (service: DataCommonService) => {
    expect(service).toBeTruthy();
  }));
});
