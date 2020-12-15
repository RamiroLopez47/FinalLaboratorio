import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalArticuloComponent } from './modal-articulo.component';

describe('ModalArticuloComponent', () => {
  let component: ModalArticuloComponent;
  let fixture: ComponentFixture<ModalArticuloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalArticuloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
