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

type DateField = 'startDate' | 'endDate';

interface CalendarDay {
  isoDate: string;
  day: number;
  inDisplayedMonth: boolean;
  disabled: boolean;
  today: boolean;
  selected: boolean;
}

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
  calendarField: DateField | null = null;
  calendarMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  calendarDays: CalendarDay[] = [];
  readonly weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
    this.updateCalendarDays();
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

  openCalendar(field: DateField): void {
    this.calendarField = this.calendarField === field ? null : field;
    const selectedDate = this.parseDate(this.tripForm.controls[field].value);
    const dateToShow = selectedDate ?? this.parseDate(
      field === 'endDate' ? this.tripForm.controls.startDate.value : ''
    ) ?? new Date();
    this.calendarMonth = new Date(dateToShow.getFullYear(), dateToShow.getMonth(), 1);
    this.updateCalendarDays();
  }

  moveCalendarMonth(offset: number): void {
    this.calendarMonth = new Date(
      this.calendarMonth.getFullYear(),
      this.calendarMonth.getMonth() + offset,
      1
    );
    this.updateCalendarDays();
  }

  selectCalendarDate(day: CalendarDay): void {
    if (day.disabled || !this.calendarField) return;

    if (this.calendarField === 'startDate') {
      const endDate = this.tripForm.controls.endDate.value;
      this.tripForm.controls.startDate.setValue(day.isoDate);
      if (endDate && endDate < day.isoDate) {
        this.tripForm.controls.endDate.setValue('');
        this.tripForm.controls.endDate.markAsUntouched();
      }
    } else {
      this.tripForm.controls.endDate.setValue(day.isoDate);
    }

    this.tripForm.controls[this.calendarField].markAsTouched();
    this.calendarField = null;
    this.updateCalendarDays();
  }

  formatDate(value: string | null | undefined): string {
    const date = this.parseDate(value);
    return date
      ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
      : 'Choose a date';
  }

  get calendarMonthLabel(): string {
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(this.calendarMonth);
  }

  handleCalendarKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.calendarField = null;
  }

  private updateCalendarDays(): void {
    const year = this.calendarMonth.getFullYear();
    const month = this.calendarMonth.getMonth();
    const first = new Date(year, month, 1);
    const mondayOffset = (first.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - mondayOffset);
    const today = this.toIsoDate(new Date());
    const selected = this.calendarField
      ? this.tripForm.controls[this.calendarField].value
      : '';
    const earliestEndDate = this.tripForm.controls.startDate.value;

    this.calendarDays = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
      const isoDate = this.toIsoDate(date);
      return {
        isoDate,
        day: date.getDate(),
        inDisplayedMonth: date.getMonth() === month,
        disabled: this.calendarField === 'endDate' && !!earliestEndDate && isoDate < earliestEndDate,
        today: isoDate === today,
        selected: isoDate === selected
      };
    });
  }

  private parseDate(value: string | null | undefined): Date | null {
    if (!value) return null;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

