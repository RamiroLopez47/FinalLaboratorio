import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticuloScreenComponent } from './articulo-screen.component';

describe('ArticuloScreenComponent', () => {
  let component: ArticuloScreenComponent;
  let fixture: ComponentFixture<ArticuloScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticuloScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticuloScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
