import { Injectable } from '@angular/core';

import { Place } from "./place.model";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  constructor() { }

  private _places: Place[] = [
      new Place(
          '1',
          'Парк Победы',
          'Мемориальный комплекс, расположенный в городе Саратов на Соколовой горе в Волжском районе города',
          'https://view-photo.ru/wp-content/uploads/2016/09/DSC04841-1080x680.jpg',
          50
      ),
      new Place(
        '2',
        'Волга',
        'Одна из крупнейших рек на Земле и самая большая по водности, площади бассейна и длине в Европе, а также крупнейшая в мире река, впадающая в бессточный (внутренний) водоём.',
        'https://www.business-vector.info/wp-content/uploads/2015/01/most2.jpg',
      50
        ),
    new Place(
        '3',
        'Проспект Кирова',
        'Проспект Кирова — одна из центральных улиц Саратова. Проходит от улицы Радищева до улицы Чапаева',
        'https://saratov.express/wp-content/uploads/2019/11/e3a6863c-4308-4c40-8deb-98c5d45d1041.png',
      50
        )

  ];

  get places() {
    return [...this._places];
  }

  getPlace(id: string) {
      return {...this._places.find(p => p.id === id)};
  }

}
