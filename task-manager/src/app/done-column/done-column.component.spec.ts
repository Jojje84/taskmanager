import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneColumnComponent } from './done-column.component';

describe('DoneColumnComponent', () => {
  let component: DoneColumnComponent;
  let fixture: ComponentFixture<DoneColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
