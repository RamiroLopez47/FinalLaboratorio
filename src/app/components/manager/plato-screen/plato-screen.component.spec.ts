import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatoScreenComponent } from './plato-screen.component';

describe('PlatoScreenComponent', () => {
  let component: PlatoScreenComponent;
  let fixture: ComponentFixture<PlatoScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlatoScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlatoScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
