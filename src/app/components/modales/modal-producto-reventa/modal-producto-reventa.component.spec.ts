import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProductoReventaComponent } from './modal-producto-reventa.component';

describe('ModalProductoReventaComponent', () => {
  let component: ModalProductoReventaComponent;
  let fixture: ComponentFixture<ModalProductoReventaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalProductoReventaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalProductoReventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
