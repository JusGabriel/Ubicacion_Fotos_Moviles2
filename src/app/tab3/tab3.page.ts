import { Component, OnInit } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PhotoService } from '../services/photo';
import { Camera, CameraResultType, CameraSource, Photo as CameraPhoto } from '@capacitor/camera';
import { CommonModule, NgIf, NgFor, DatePipe } from '@angular/common'; // <-- Import clave


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, NgIf, NgFor, DatePipe],
})
export class Tab3Page implements OnInit {
  description: string = '';
  amount: number | null = null;
  payer: string = '';
  photo: CameraPhoto | null = null;
  photoPreview: string | null = null;

  photos: any[] = [];  // <-- agregado

  constructor(public photoService: PhotoService, private platform: Platform) {}

  ngOnInit() {
    this.photoService.loadSaved();
    this.photoService.photosChanged.subscribe(photos => {
      this.photos = photos;  // ahora sí reconoce 'photos'
    });
  }


  async takePhoto() {
    this.photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    if (this.platform.is('hybrid')) {
      // Para dispositivos móviles, convertir a base64 para mostrar preview
      const file = await this.readAsBase64(this.photo);
      this.photoPreview = file;
    } else {
      // Para web usar la url webPath
      this.photoPreview = this.photo.webPath || null;
    }
  }

  // Método auxiliar para leer la foto en base64 (similar a PhotoService)
  private async readAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
    return await this.convertBlobToBase64(blob);
  }

  private convertBlobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

async submitForm() {
  if (this.photo && this.description && this.amount !== null && this.payer) {
    await this.photoService.addPhotoWithData(
      this.photo,
      this.description,
      new Date().toISOString(),
      this.amount,
      this.payer
    );

    // Limpiar campos después de guardar
    this.description = '';
    this.amount = null;
    this.payer = '';
    this.photo = null;
    this.photoPreview = null;
  }
}
async onFileSelected(event: any) {
  const file: File = event.target.files[0];
  if (file) {
    try {
      await this.photoService.addPhotoFromTxt(file);
      alert('Gastos importados correctamente desde el archivo .txt');
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      alert('Hubo un error al importar los gastos.');
    }
  }
}

deletePhoto(photo: any, index: number) {
  if (confirm('¿Deseas eliminar esta foto?')) {
    this.photoService.deletePhoto(photo, index);
  }
}


}
