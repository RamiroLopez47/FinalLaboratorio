import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerscreenComponent } from './managerscreen.component';

describe('ManagerscreenComponent', () => {
  let component: ManagerscreenComponent;
  let fixture: ComponentFixture<ManagerscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
