import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsCashierComponent } from './order-details-cashier.component';

describe('OrderDetailsCashierComponent', () => {
  let component: OrderDetailsCashierComponent;
  let fixture: ComponentFixture<OrderDetailsCashierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsCashierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
