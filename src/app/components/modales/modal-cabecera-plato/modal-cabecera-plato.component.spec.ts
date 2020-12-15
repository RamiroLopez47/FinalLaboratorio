import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCabeceraPlatoComponent } from './modal-cabecera-plato.component';

describe('ModalCabeceraPlatoComponent', () => {
  let component: ModalCabeceraPlatoComponent;
  let fixture: ComponentFixture<ModalCabeceraPlatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCabeceraPlatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCabeceraPlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
