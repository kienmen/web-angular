import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelContainerViewComponent } from './model-container-view.component';

describe('ModelContainerViewComponent', () => {
  let component: ModelContainerViewComponent;
  let fixture: ComponentFixture<ModelContainerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelContainerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelContainerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
