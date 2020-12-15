import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaPlatoScreenComponent } from './categoria-plato-screen.component';

describe('CategoriaPlatoScreenComponent', () => {
  let component: CategoriaPlatoScreenComponent;
  let fixture: ComponentFixture<CategoriaPlatoScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaPlatoScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaPlatoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
