import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaPlatosScreenComponent } from './estadistica-platos-screen.component';

describe('EstadisticaPlatosScreenComponent', () => {
  let component: EstadisticaPlatosScreenComponent;
  let fixture: ComponentFixture<EstadisticaPlatosScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadisticaPlatosScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticaPlatosScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
