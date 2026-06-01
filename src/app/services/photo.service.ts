import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {

  // Toma una foto y devuelve el dataUrl (base64) para mostrarla
  async takePhoto(): Promise<string | undefined> {
    const photo: Photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    return photo.dataUrl;
  }
}