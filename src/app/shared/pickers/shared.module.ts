import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { LocationPickerComponent } from "./location-picker/location-picker.component";
import { MapModalComponent } from "../map-modal/map-modal.component";
import { ImagePickerComponent } from "./image-picker/image-picker.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [
        LocationPickerComponent,
        MapModalComponent,
        ImagePickerComponent
    ],
    exports: [
        LocationPickerComponent,
        MapModalComponent,
        ImagePickerComponent
    ],
    entryComponents: [
        MapModalComponent
    ]
})
export class SharedModule {}