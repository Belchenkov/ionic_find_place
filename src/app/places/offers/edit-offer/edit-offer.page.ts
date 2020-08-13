import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController, NavController } from "@ionic/angular";
import { Subscription } from "rxjs";

import { Place } from "../../place.model";
import { PlacesService } from "../../places.service";

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading: boolean = false;
  placeId;
  private placeSub: Subscription;

  constructor(
      private route: ActivatedRoute,
      private placesService: PlacesService,
      private navCtrl: NavController,
      private router: Router,
      private loadingCtrl: LoadingController,
      private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.placeId = paramMap.get('placeId');
      this.isLoading = true;

      this.placeSub = this.placesService
          .getPlace(this.placeId)
          .subscribe(place => {
            this.place = place;
            this.form = new FormGroup({
              title: new FormControl(this.place.title, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              description: new FormControl(this.place.description, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(180)]
              })
            });
            this.isLoading = false;
          }, error => {
            this.isLoading = false;
            this.alertCtrl.create({
              header: 'An error occurred!',
              message: 'Place could not be fetched. Please try again later.',
              buttons: [{
                text: 'Ok',
                handler: () => {
                  this.router.navigate(['/places/tabs/offers']);
                }
              }]
            }).then(alertEl => {
              alertEl.present();
            })
          });
    });
  }

  onEditOffer() {
    if (!this.form.valid) return;

    const { title, description } = this.form.value;

    this.loadingCtrl.create({
      message: 'Updating place...'
    }).then(loadingEl => {
      loadingEl.present();

      this.placesService.updatePlace(this.place.id, title, description)
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
