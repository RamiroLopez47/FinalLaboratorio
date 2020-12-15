import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMedidaArticuloComponent } from './modal-medida-articulo.component';

describe('ModalMedidaArticuloComponent', () => {
  let component: ModalMedidaArticuloComponent;
  let fixture: ComponentFixture<ModalMedidaArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMedidaArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMedidaArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
