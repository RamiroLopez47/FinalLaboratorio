import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockBajoComponent } from './stock-bajo.component';

describe('StockBajoComponent', () => {
  let component: StockBajoComponent;
  let fixture: ComponentFixture<StockBajoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockBajoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockBajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
