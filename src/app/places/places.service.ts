import { Injectable } from '@angular/core';

import { Place } from "./place.model";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
        '1',
        'Волга',
        'Одна из крупнейших рек на Земле и самая большая по водности, площади бассейна и длине в Европе, а также крупнейшая в мире река, впадающая в бессточный (внутренний) водоём.',
        'https://www.business-vector.info/wp-content/uploads/2015/01/most2.jpg',
      50
        ),
    new Place(
        '2',
        'Проспект Кирова',
        'Проспект Кирова — одна из центральных улиц Саратова. Проходит от улицы Радищева до улицы Чапаева',
        'https://saratov.express/wp-content/uploads/2019/11/e3a6863c-4308-4c40-8deb-98c5d45d1041.png',
      50
        ),
    new Place(
        '3',
        'Парк Победы',
        'Мемориальный комплекс, расположенный в городе Саратов на Соколовой горе в Волжском районе города',
        'https://lh5.googleusercontent.com/p/AF1QipN4X4sHUCDWudWrKhAN0wdwJ3r9wX339nrsmmHn=w296-h202-n-k-no',
      50
        )
  ];

  get places() {
    return [...this._places];
  }

  constructor() { }
}
