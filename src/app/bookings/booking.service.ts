import { Injectable } from "@angular/core";

import { Booking } from "./booking.model";

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings: Booking[] = [
        {
            id: '1',
            placeId: 'p1',
            placeTitle: 'Проспект Кирова',
            guestNumber: 2,
            userId: '12ef',
        }
    ];

    get bookings() {
        return [...this._bookings];
    }
}