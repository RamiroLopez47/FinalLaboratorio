import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaIngresosScreenComponent } from './estadistica-ingresos-screen.component';

describe('EstadisticaIngresosScreenComponent', () => {
  let component: EstadisticaIngresosScreenComponent;
  let fixture: ComponentFixture<EstadisticaIngresosScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticaIngresosScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticaIngresosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
