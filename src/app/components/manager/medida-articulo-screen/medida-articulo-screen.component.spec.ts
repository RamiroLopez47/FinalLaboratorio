import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidaArticuloScreenComponent } from './medida-articulo-screen.component';

describe('MedidaArticuloScreenComponent', () => {
  let component: MedidaArticuloScreenComponent;
  let fixture: ComponentFixture<MedidaArticuloScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedidaArticuloScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidaArticuloScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
