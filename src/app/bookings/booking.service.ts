import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take, tap, switchMap, map } from "rxjs/operators";
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
        let newBooking: Booking;
        let fetchedUserId: string;

        return this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('No user id found!');
                    }

                    fetchedUserId = userId;
                    return this.authService.token;
                }),
                take(1),
                switchMap(token => {
                    newBooking = new Booking(
                        Math.random().toString(),
                        placeId,
                        fetchedUserId,
                        placeTitle,
                        placeImage,
                        firstName,
                        lastName,
                        guestNumber,
                        dateFrom,
                        dateTo
                    );

                    return this.http.post<{name: string}>(
                        `${this.apiUrl}/bookings.json?auth=${token}`,
                        {...newBooking, id: null}
                    );
                }),
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
        return this.authService.token
            .pipe(
                take(1),
                switchMap(token => {
                    return this.http.delete(`${this.apiUrl}/bookings/${bookingId}.json?auth=${token}`)
                }),
                switchMap(() => {
                    return this.bookings;
                }),
                take(1),
                tap(bookings => {
                    this._bookings.next(bookings.filter(b => b.id !== bookingId));
                })
            );
    }

    fetchingBookings() {
        let fetchedUserId: string;

        this.authService.userId
            .pipe(
                take(1),
                switchMap(userId => {
                    if (!userId) {
                        throw new Error('User not found!');
                    }

                    fetchedUserId = userId;
                    return  this.authService.token;
                }),
                take(1),
                switchMap(token => {
                    return this.http
                        .get<{ [key: string]: BookingData }>(
                            `${this.apiUrl}/bookings.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
                        )
                }),
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