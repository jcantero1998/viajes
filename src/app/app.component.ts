import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { GooglePhotosService } from './services/google-photos.service';
import { Album } from './model/album';
import { firstValueFrom } from 'rxjs';
import { GoogleApiService } from './services/google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  albums: Album[] = [];
  title = 'gallery';
  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 100;
  }

  constructor(
    private readonly google: GoogleApiService,
    private googlePhotosService: GooglePhotosService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.google.initialized$.subscribe(() => {
      this.getAlbums();
    });
  }

  async getAlbums() {
    try {
      const data: any = await firstValueFrom(this.googlePhotosService.getSharedAlbumsForUser());

      if (data.sharedAlbums && data.sharedAlbums.length > 0) {

        //Filtramos los albumes y nos quedamos unicamente con los que tengan fotos
        const filteredAlbums = data.sharedAlbums.filter((element: any) => parseInt(element.mediaItemsCount) > 1);

        const albumPromises = filteredAlbums.map(async (element: any) => {
          const galleryImage = await this.getPhotosFromAlbum(element.id);
          return {
            id: element.id,
            title: element.title,
            galleryImage,
          };
        });

        this.albums = await Promise.all(albumPromises);
      }
    } catch (error) {
      console.error('Error obteniendo álbumes:', error);
    }
  }

  async getPhotosFromAlbum(id: string) {
    try {
      const data: any = await firstValueFrom(this.googlePhotosService.getPhotosFromAlbum(id));
      if (data && data.mediaItems && Array.isArray(data.mediaItems)) {
        const filteredMediaItems = data.mediaItems.filter((item: any) => item.mimeType != "video/mp4");
        return filteredMediaItems;
      } else {
        console.warn('Los datos recibidos no contienen mediaItems o no es un arreglo.');
        return [];
      }
    } catch (error) {
      console.error('Error obteniendo fotos del álbum:', error);
      return [];
    }
  }



  scrollToTop() {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }
}
