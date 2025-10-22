import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo as CameraPhoto } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PhotoService } from '../services/photo';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonicModule,  // para ion-*
    FormsModule,  // para ngModel
    CommonModule
  ],
})
export class Tab2Page {
  photo: CameraPhoto | null = null;
  photoPreview: string | null = null;
  mapsLink: string = '';
  saveLocation: boolean = false; // checkbox
  locationCoords: { lat: number; lng: number } | null = null;

  constructor(private platform: Platform, private router: Router, private photoService: PhotoService) {}

  // 📸 Tomar foto y obtener ubicación
  async takePhoto() {
    try {
      // Tomar foto
      this.photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      // Mostrar previsualización
      if (this.platform.is('hybrid')) {
        this.photoPreview = await this.readAsBase64(this.photo);
      } else {
        this.photoPreview = this.photo.webPath || null;
      }

      // Obtener ubicación
      const position = await Geolocation.getCurrentPosition();
      this.locationCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Crear enlace a Google Maps
      this.mapsLink = `https://www.google.com/maps/@${this.locationCoords.lat},${this.locationCoords.lng}`;
    } catch (error) {
      console.error('Error al tomar foto o ubicación:', error);
      this.locationCoords = null;
      this.mapsLink = '';
    }
  }

  // 📤 Convertir a base64
  private async readAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  }

async savePhoto() {
  if (!this.photo) {
    alert('Primero toma una foto');
    return;
  }

  try {
    // Guardar foto y datos en PhotoService
    await this.photoService.addPhotoWithData(
      this.photo,
      'Foto tomada desde Tab2',                 // descripción
      new Date().toISOString(),                 // fecha actual
      0,                                        // amount (opcional)
      'Usuario',                                // payer (opcional)
      this.locationCoords?.lat,                 // latitud
      this.locationCoords?.lng,                 // longitud
      this.mapsLink                              // link de Google Maps
    );

    alert('✅ Foto y ubicación guardadas en la galería');

    // Limpiar campos
    this.photo = null;
    this.photoPreview = null;
    this.mapsLink = '';
    this.locationCoords = null;
    this.saveLocation = false;

    // Navegar a la galería
    this.router.navigate(['/tabs/tab3']);
  } catch (error) {
    console.error('Error al guardar la foto:', error);
    alert('❌ Hubo un error al guardar la foto.');
  }
}
}
