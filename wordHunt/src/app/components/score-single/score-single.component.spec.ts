import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreSingleComponent } from './score-single.component';

describe('ScoreSingleComponent', () => {
  let component: ScoreSingleComponent;
  let fixture: ComponentFixture<ScoreSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreSingleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
