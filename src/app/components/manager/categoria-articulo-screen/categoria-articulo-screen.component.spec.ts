import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaArticuloScreenComponent } from './categoria-articulo-screen.component';

describe('CategoriaArticuloScreenComponent', () => {
  let component: CategoriaArticuloScreenComponent;
  let fixture: ComponentFixture<CategoriaArticuloScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaArticuloScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaArticuloScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
