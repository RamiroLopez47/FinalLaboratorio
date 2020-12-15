import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCategoriaArticuloComponent } from './modal-categoria-articulo.component';

describe('ModalCategoriaArticuloComponent', () => {
  let component: ModalCategoriaArticuloComponent;
  let fixture: ComponentFixture<ModalCategoriaArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCategoriaArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCategoriaArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
