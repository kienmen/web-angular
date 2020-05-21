import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelRemarkComponent } from './model-remark.component';

describe('ModelRemarkComponent', () => {
  let component: ModelRemarkComponent;
  let fixture: ComponentFixture<ModelRemarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelRemarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
