import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCategoriaPlatoComponent } from './modal-categoria-plato.component';

describe('ModalCategoriaPlatoComponent', () => {
  let component: ModalCategoriaPlatoComponent;
  let fixture: ComponentFixture<ModalCategoriaPlatoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCategoriaPlatoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCategoriaPlatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
