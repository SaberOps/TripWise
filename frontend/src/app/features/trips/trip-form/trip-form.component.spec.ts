import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripFormComponent } from './trip-form.component';
import { provideRouter } from '@angular/router';

describe('TripFormComponent', () => {
  let component: TripFormComponent;
  let fixture: ComponentFixture<TripFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripFormComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
