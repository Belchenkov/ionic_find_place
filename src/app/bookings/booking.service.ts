import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take, tap, delay, switchMap, map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { Booking } from "./booking.model";
import { AuthService } from "../auth/auth.service";
import { environment } from "../../environments/environment";

interface BookingData {
    bookedFrom: string;
    bookedTo: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings = new BehaviorSubject<Booking[]>([]);
    apiUrl: string = environment.apiUrl;

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) { }

    get bookings() {
        return this._bookings.asObservable();
    }

    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {
        let generatedId: string;
        const newBooking = new Booking(
            Math.random().toString(),
            placeId,
            this.authService.userId,
            placeTitle,
            placeImage,
            firstName,
            lastName,
            guestNumber,
            dateFrom,
            dateTo
        );

        return this.http.post<{name: string}>(`${this.apiUrl}/bookings.json`, {...newBooking, id: null})
            .pipe(
                switchMap(resData => {
                    generatedId = resData.name;
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    newBooking.id = generatedId;
                    this._bookings.next(bookings.concat(newBooking));
                })
            );
    }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(
            take(1),
            delay(2000),
            tap(bookings => {
                this._bookings.next(bookings.filter(b => b.id !== bookingId));
            })
        );
    }

    fetchingBookings() {
        return this.http
            .get<{ [key: string]: BookingData }>(
                `${this.apiUrl}/bookings.json?orderBy="userId"&equalTo="${this.authService.userId}"`
            ).pipe(
                map(bookingData => {
                    const bookings = [];

                    for (const key in bookingData) {
                        if (bookingData.hasOwnProperty(key)) {
                            bookings.push(new Booking(
                                key,
                                bookingData[key].placeId,
                                bookingData[key].userId,
                                bookingData[key].placeTitle,
                                bookingData[key].placeImage,
                                bookingData[key].firstName,
                                bookingData[key].lastName,
                                bookingData[key].guestNumber,
                                new Date(bookingData[key].bookedFrom),
                                new Date(bookingData[key].bookedTo)
                            ));
                        }
                    }

                    return bookings;
            }),
            tap(bookings => {
                this._bookings.next(bookings);
            })
        );
    }
}