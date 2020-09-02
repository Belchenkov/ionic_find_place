import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';
import { CameraResultType, CameraSource, Capacitor, Plugins } from "@capacitor/core";

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @Output() imagePick = new EventEmitter<string>();

  selectedImage: string;

  constructor() { }

  ngOnInit() {}

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.selectedImage = image.base64String;
      this.imagePick.emit(image.base64String);
    }).catch(error => {
      console.log(error);
      return false;
    });
  }

}
