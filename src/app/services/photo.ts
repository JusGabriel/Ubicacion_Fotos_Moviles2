import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo as CameraPhoto } from '@capacitor/camera';
import { Filesystem, Directory, ReadFileResult } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';

  // Observable para notificar cambios
  public photosChanged: BehaviorSubject<UserPhoto[]> = new BehaviorSubject<UserPhoto[]>([]);

  constructor(private platform: Platform) {}

  // Captura y guarda la foto
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    await this.saveToPreferences();
    this.photosChanged.next(this.photos);
  }

  // Guardar foto en filesystem
  private async savePicture(cameraPhoto: CameraPhoto): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    const newPhoto: UserPhoto = {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
      description: '',
      date: '',
    };

    return newPhoto;
  }

  // Convertir CameraPhoto a base64
  private async readAsBase64(cameraPhoto: CameraPhoto): Promise<string> {
    if (this.platform.is('hybrid')) {
      const file: ReadFileResult = await Filesystem.readFile({
        path: cameraPhoto.path!,
      });
      return file.data as string;
    } else {
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob);
    }
  }

  private convertBlobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

  // Cargar fotos al iniciar la app
  public async loadSaved() {
    const photoList = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = photoList.value ? JSON.parse(photoList.value) : [];
    this.photosChanged.next(this.photos);
  }

  // Eliminar foto
  public async deletePhoto(photo: UserPhoto, position: number) {
    this.photos.splice(position, 1);
    await this.saveToPreferences();
    this.photosChanged.next(this.photos);

    if (this.platform.is('hybrid') && photo.filepath) {
      await Filesystem.deleteFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
    }
  }

public async addPhotoWithData(
    cameraPhoto: CameraPhoto,
    description: string,
    date: string = '',
    amount: number = 0,
    payer: string = '',
    lat?: number,
    lng?: number,
    mapsLink?: string
) {
    const savedImageFile = await this.savePicture(cameraPhoto);

    savedImageFile.description = description;
    savedImageFile.date = date;
    savedImageFile.amount = amount;
    savedImageFile.payer = payer;
    if (lat !== undefined) savedImageFile.lat = lat;
    if (lng !== undefined) savedImageFile.lng = lng;
    if (mapsLink) savedImageFile.mapsLink = mapsLink;

    this.photos.unshift(savedImageFile);
    await this.saveToPreferences();
    this.photosChanged.next(this.photos);
}


  // Agregar datos desde un archivo .txt
  public async addPhotoFromTxt(file: File) {
    const textContent = await this.readTxtFile(file);

    const lines = textContent.split('\n');
    for (let line of lines) {
      if (!line.trim()) continue;
      const [description, date, amountStr, payer] = line.split(',');
      const amount = parseFloat(amountStr) || 0;

      const newPhoto: UserPhoto = {
        filepath: '',
        webviewPath: '', 
        description: description?.trim() || '',
        date: date?.trim() || '',
        amount,
        payer: payer?.trim() || '',
      };

      this.photos.unshift(newPhoto);
    }

    await this.saveToPreferences();
    this.photosChanged.next(this.photos);
  }

  private async readTxtFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private async saveToPreferences() {
    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  // Calcular gasto total por mes
  public getMonthlyExpenses(): { [month: string]: number } {
    const expensesByMonth: { [month: string]: number } = {};

    this.photos.forEach((photo) => {
      if (photo.amount && photo.date) {
        const date = new Date(photo.date);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        if (!expensesByMonth[monthKey]) expensesByMonth[monthKey] = 0;
        expensesByMonth[monthKey] += photo.amount;
      }
    });

    return expensesByMonth;
  }

  // Calcular gasto total general
  public getTotalExpenses(): number {
    return this.photos.reduce((total, photo) => total + (photo.amount || 0), 0);
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  description?: string;
  date?: string;
  amount?: number;
  payer?: string;
  txtContent?: string;
  lat?: number;       // NUEVO: latitud
  lng?: number;       // NUEVO: longitud
  mapsLink?: string;  // NUEVO: link de Google Maps
}
