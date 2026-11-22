
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationService } from '../../../core/services/destination.service';
import { TripService } from '../../../core/services/trip.service';

function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (startDate && endDate && endDate < startDate) {
    return { invalidDateRange: true };
  }

  return null;
}

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './trip-form.component.html',
  styleUrl: './trip-form.component.css'
})
export class TripFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly tripService = inject(TripService);
  private readonly destinationService = inject(DestinationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly destinations = this.destinationService.getAll();

  tripId: number | null = null;
  isEditMode = false;

  tripForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    destinationId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    budget: [1000, [Validators.required, Validators.min(1)]],
    travelers: [1, [Validators.required, Validators.min(1)]],
    status: ['Planned', Validators.required],
    notes: ['']
  }, {
    validators: dateRangeValidator
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.tripId = Number(id);
      this.isEditMode = true;

      const trip = this.tripService.getById(this.tripId);

      if (!trip) {
        this.router.navigate(['/trips']);
        return;
      }

      this.tripForm.patchValue({
        ...trip,
        destinationId: String(trip.destinationId)
      });
    }
  }

  get title() {
    return this.tripForm.get('title');
  }

  get dateRangeInvalid(): boolean {
    return this.tripForm.hasError('invalidDateRange') &&
      !!this.tripForm.get('endDate')?.touched;
  }

  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const formValue = this.tripForm.getRawValue();

    const tripData = {
      title: formValue.title!,
      destinationId: Number(formValue.destinationId),
      startDate: formValue.startDate!,
      endDate: formValue.endDate!,
      budget: Number(formValue.budget),
      travelers: Number(formValue.travelers),
      status: formValue.status as 'Planned' | 'Ongoing' | 'Completed',
      notes: formValue.notes ?? ''
    };

    if (this.isEditMode && this.tripId !== null) {
      this.tripService.update(this.tripId, tripData);
    } else {
      this.tripService.add(tripData);
    }

    this.router.navigate(['/trips']);
  }

  cancel(): void {
    this.router.navigate(['/trips']);
  }
}

