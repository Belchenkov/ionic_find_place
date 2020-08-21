import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LocationPickerComponent } from "./location-picker/location-picker.component";
import { MapModalComponent } from "../map-modal/map-modal.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LocationPickerComponent,
        MapModalComponent
    ],
    exports: [
        LocationPickerComponent,
        MapModalComponent
    ],
    entryComponents: [
        MapModalComponent
    ]
})
export class SharedModule {}