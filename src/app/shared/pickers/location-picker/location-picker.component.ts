import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { MapModalComponent } from "../../map-modal/map-modal.component";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  constructor(
      private modalCtrl: ModalController,
      private http: HttpClient
  ) { }

  ngOnInit() {}

  onPickLocation() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss()
          .then(modalData => {
            if (!modalData.data) {
              return;
            }

            this.getAddress(modalData.data.lat, modalData.data.lng)
                .subscribe(address => {
                  console.log(address);
                });
          });

      modalEl.present();
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}
              &key=${+ environment.googleMapsAPIKey}`)
        .pipe(map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }

          return geoData.results[0].formatted_address;
        }));
  }

}
