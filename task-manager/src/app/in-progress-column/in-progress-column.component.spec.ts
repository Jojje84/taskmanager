import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InProgressColumnComponent } from './in-progress-column.component';

describe('InProgressColumnComponent', () => {
  let component: InProgressColumnComponent;
  let fixture: ComponentFixture<InProgressColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InProgressColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InProgressColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
