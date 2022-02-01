import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongTypeComponent } from './wrong-type.component';

describe('WrongTypeComponent', () => {
  let component: WrongTypeComponent;
  let fixture: ComponentFixture<WrongTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrongTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
