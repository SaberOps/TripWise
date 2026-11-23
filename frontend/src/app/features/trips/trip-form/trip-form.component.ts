import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Destination } from '../../../core/models/destination.model';
import { TripStatus } from '../../../core/models/trip.model';
import { DestinationService } from '../../../core/services/destination.service';
import { TripService } from '../../../core/services/trip.service';

function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;
  return startDate && endDate && endDate < startDate
    ? { invalidDateRange: true }
    : null;
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

  destinations: Destination[] = [];
  tripId: string | null = null;
  isEditMode = false;
  isLoading = true;
  isSaving = false;
  errorMessage = '';

  tripForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    destinationId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    budget: [1000, [Validators.required, Validators.min(1)]],
    travelers: [1, [Validators.required, Validators.min(1)]],
    status: ['Planned' as TripStatus, Validators.required],
    notes: ['']
  }, { validators: dateRangeValidator });

  ngOnInit(): void {
    this.tripId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.tripId;

    this.destinationService.getAll().subscribe({
      next: response => {
        this.destinations = response.data;
        if (this.isEditMode && this.tripId) {
          this.loadTrip(this.tripId);
        } else {
          this.isLoading = false;
        }
      },
      error: error => {
        console.error('Unable to load destinations:', error);
        this.errorMessage = 'Unable to load destinations. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private loadTrip(id: string): void {
    this.tripService.getById(id).subscribe({
      next: response => {
        const trip = response.data;
        this.tripForm.patchValue({
          title: trip.title,
          destinationId: trip.destinationId._id,
          startDate: trip.startDate.slice(0, 10),
          endDate: trip.endDate.slice(0, 10),
          budget: trip.budget,
          travelers: trip.travelers,
          status: trip.status,
          notes: trip.notes ?? ''
        });
        this.isLoading = false;
      },
      error: error => {
        console.error('Unable to load trip:', error);
        this.errorMessage = 'Trip not found or could not be loaded.';
        this.isLoading = false;
      }
    });
  }

  get title() {
    return this.tripForm.get('title');
  }

  get dateRangeInvalid(): boolean {
    return this.tripForm.hasError('invalidDateRange')
      && !!this.tripForm.get('endDate')?.touched;
  }

  onSubmit(): void {
    if (this.tripForm.invalid) {
      this.tripForm.markAllAsTouched();
      return;
    }

    const value = this.tripForm.getRawValue();
    const tripData = {
      title: value.title!.trim(),
      destinationId: value.destinationId!,
      startDate: value.startDate!,
      endDate: value.endDate!,
      budget: Number(value.budget),
      travelers: Number(value.travelers),
      status: value.status!,
      notes: value.notes ?? ''
    };

    this.isSaving = true;
    this.errorMessage = '';

    const request = this.isEditMode && this.tripId
      ? this.tripService.update(this.tripId, tripData)
      : this.tripService.add(tripData);

    request.subscribe({
      next: () => this.router.navigate(['/trips']),
      error: error => {
        console.error('Unable to save trip:', error);
        this.errorMessage = error?.error?.message || 'Unable to save trip. Please try again.';
        this.isSaving = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/trips']);
  }
}

