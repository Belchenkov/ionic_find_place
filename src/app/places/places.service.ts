import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  constructor(
      private authService: AuthService
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

  getPlace(id: string) {
      return {...this._places.find(p => p.id === id)};
  }

  addPlace(
      title: string,
      description: string,
      price: number,
      dateFrom: Date,
      dateTo: Date
  ) {
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
    this.places
        .pipe(take(1))
        .subscribe(places => {
            this._places.next(places.concat(newPlace));
        });
  }
}
