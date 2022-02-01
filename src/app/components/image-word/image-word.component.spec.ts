import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageWordComponent } from './image-word.component';

describe('ImageWordComponent', () => {
  let component: ImageWordComponent;
  let fixture: ComponentFixture<ImageWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
