import { Component, OnInit } from '@angular/core';
import { MenuController } from "@ionic/angular";
import { SegmentChangeEventDetail } from '@ionic/core';

import { PlacesService } from "../places.service";
import { Place } from "../place.model";

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];

  constructor(
      private placesService: PlacesService,
      private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.loadedPlaces.slice(1);
  }

  onFilterUpdate($event: CustomEvent<SegmentChangeEventDetail>) {

  }
}
