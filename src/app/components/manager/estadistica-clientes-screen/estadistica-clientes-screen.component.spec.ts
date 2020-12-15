import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaClientesScreenComponent } from './estadistica-clientes-screen.component';

describe('EstadisticaClientesScreenComponent', () => {
  let component: EstadisticaClientesScreenComponent;
  let fixture: ComponentFixture<EstadisticaClientesScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticaClientesScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticaClientesScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
