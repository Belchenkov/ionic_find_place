import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";

import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { environment } from "../../environments/environment";

interface PlaceData {
    availableFrom: string;
    availableTo: string;
    description: string;
    imageUrl: string;
    price: number;
    title: string;
    userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  apiUrl: string = environment.apiUrl;

  constructor(
      private authService: AuthService,
      private http: HttpClient
  ) { }

  private _places = new BehaviorSubject<Place[]>([
      new Place(
          '1',
          'Парк Победы',
          'Мемориальный комплекс, расположенный в городе Саратов на Соколовой горе в Волжском районе города',
          'https://view-photo.ru/wp-content/uploads/2016/09/DSC04841-1080x680.jpg',
          50,
           new Date('2020-09-01'),
           new Date('2020-12-31'),
          'abc'
      ),
      new Place(
        '2',
        'Волга',
        'Одна из крупнейших рек на Земле и самая большая по водности, площади бассейна и длине в Европе, а также крупнейшая в мире река, впадающая в бессточный (внутренний) водоём.',
        'https://www.business-vector.info/wp-content/uploads/2015/01/most2.jpg',
      50,
          new Date('2020-09-05'),
          new Date('2020-12-31'),
          'abc'
        ),
    new Place(
        '3',
        'Проспект Кирова',
        'Проспект Кирова — одна из центральных улиц Саратова. Проходит от улицы Радищева до улицы Чапаева',
        'https://saratov.express/wp-content/uploads/2019/11/e3a6863c-4308-4c40-8deb-98c5d45d1041.png',
      50,
        new Date('2020-09-15'),
        new Date('2020-12-31'),
        'abc'
        )
  ]);

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
      return this.http.get<{[key: string]: PlaceData}>(`${this.apiUrl}/offered-places.json`)
          .pipe(
                map(resData => {
                    const places = [];
                    for(const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            places.push(
                                new Place(
                                    key,
                                    resData[key].title,
                                    resData[key].description,
                                    resData[key].imageUrl,
                                    resData[key].price,
                                    new Date(resData[key].availableFrom),
                                    new Date(resData[key].availableTo),
                                    resData[key].userId
                                )
                            );
                        }
                    }
                    return places;
                }),
                tap(places => {
                    this._places.next(places);
                })
      );
  }

  getPlace(id: string) {
      return this.places.pipe(
          take(1),
          map(places => {
            return {...places.find(p => p.id === id)};
          })
      );
  }

  addPlace(
      title: string,
      description: string,
      price: number,
      dateFrom: Date,
      dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
        Math.random().toString(),
        title,
        description,
        'https://r-cf.bstatic.com/images/hotel/max1024x768/994/9942054.jpg',
        price,
        dateFrom,
        dateTo,
        this.authService.userId
    );

    return this.http
        .post<{name: string}>(`${this.apiUrl}/offered-places.json`, { ...newPlace, id: null })
        .pipe(
            switchMap(resData => {
                generatedId = resData.name;
                return this.places;
            }),
            take(1),
            tap(places => {
                newPlace.id = generatedId;
                this._places.next(places.concat(newPlace));
            })
        );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];

    return this.places.pipe(
        take(1),
        switchMap(places => {
            const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
            updatedPlaces = [...places];
            const oldPlace = updatedPlaces[updatedPlaceIndex];

            updatedPlaces[updatedPlaceIndex] = new Place(
                oldPlace.id,
                title,
                description,
                oldPlace.imageUrl,
                oldPlace.price,
                oldPlace.availableFrom,
                oldPlace.availableTo,
                oldPlace.userId
            );

            return  this.http.put(
                `${this.apiUrl}/offered-places/${placeId}.json`,
                { ...updatedPlaces[updatedPlaceIndex], id: null }
            );
        }),
        tap(() => {
            this._places.next(updatedPlaces);
        })
    );
  }
}
