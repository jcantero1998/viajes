import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { GalleryService } from '../../services/gallery.service';
import { GalleryModalComponent } from '../gallery-modal/gallery-modal.component';
import { filter, map } from 'rxjs/operators';
import { GalleryImage } from '../../model/gallery-image';
import { HttpClient } from '@angular/common/http';
import { Album } from 'src/app/model/album';
import { PhotosFromAlbum } from 'src/app/model/photos-from-album';
import { GooglePhotosService } from 'src/app/services/google-photos.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
  @Input() album!: Album;
  subscription: Subscription[] = [];
  columns = 5;
  gallery: GalleryImage[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private galleryService: GalleryService,
    private googlePhotosService: GooglePhotosService,
    private mediaObserver: MediaObserver
  ) {}

  ngOnInit(): void {
    this.createGallery();
    this.mediaChange();
  }

  async createGallery() {
    for (let i = 0; i < this.album.photosFromAlbum.mediaItems.length; i++) {
      this.gallery.push({
        src: this.album.photosFromAlbum.mediaItems[i].baseUrl,
        position: i,
        alt: `${this.album.title} ${i}`,
        first: i === 0,
        last: i === this.album.photosFromAlbum.mediaItems.length - 1,
      });
    }
  }

  getIndex(index: string): Observable<any> {
    return this.http.get<any>(index);
  }

  openDialog(position: number): void {
    if (position >= 0 && position < this.gallery.length) {
      this.galleryService.selectImage(this.gallery, position);
    }
    this.dialog.open(GalleryModalComponent, {
      panelClass: 'custom-dialog-container',
    });
  }

  private mediaChange(): void {
    this.subscription.push(
      this.mediaObserver
        .asObservable()
        .pipe(
          filter((changes: MediaChange[]) => changes.length > 0),
          map((changes: MediaChange[]) => changes[0])
        )
        .subscribe((change: MediaChange) => {
          switch (change.mqAlias) {
            case 'xs': {
              this.columns = 1;
              break;
            }
            case 'sm': {
              this.columns = 2;
              break;
            }
            case 'md': {
              this.columns = 3;
              break;
            }
            case 'lg': {
              this.columns = 5;
              break;
            }
            default: {
              this.columns = 6;
              break;
            }
          }
        })
    );
  }

  async loadMorePhotosFromAlbum(id: string, nextPageToken?: string): Promise<PhotosFromAlbum> {
    try {
      this.loading = true;
      const data: PhotosFromAlbum = await firstValueFrom(this.googlePhotosService.getPhotosFromAlbum(id, nextPageToken));
      if (data && data.mediaItems && Array.isArray(data.mediaItems)) {
        const filteredMediaItems = data.mediaItems.filter((item: any) => item.mimeType != "video/mp4");
        return { mediaItems: filteredMediaItems, nextPageToken: data.nextPageToken };
      } else {
        console.warn('Los datos recibidos no contienen mediaItems o no es un arreglo.');
        this.loading = false;
        return { mediaItems: [], nextPageToken: null };
      }
    } catch (error) {
      console.error('Error obteniendo fotos del álbum:', error);
      this.loading = false;
      return { mediaItems: [], nextPageToken: null };
    } finally {
      this.loading = false;
    }
  }

  async onScroll() {
    if (this.album.photosFromAlbum.nextPageToken) {
      const additionalPhotos = await this.loadMorePhotosFromAlbum(this.album.id, this.album.photosFromAlbum.nextPageToken);
      if (additionalPhotos.mediaItems.length > 0) {
        this.album.photosFromAlbum.mediaItems.push(...additionalPhotos.mediaItems);
        this.album.photosFromAlbum.nextPageToken = additionalPhotos.nextPageToken;
        this.addAdditionalPhotos(additionalPhotos);
      }
    }
  }

  addAdditionalPhotos(additionalPhotos: PhotosFromAlbum){
    this.gallery[this.gallery.length - 1].last = false;

    additionalPhotos.mediaItems.forEach(mediaItem => {
      this.gallery.push({
        src: mediaItem.baseUrl,
        position: this.gallery.length,
        alt: `${this.album.title} ${ this.gallery.length}`,
        first: false,
        last: mediaItem === additionalPhotos.mediaItems[additionalPhotos.mediaItems.length - 1],
      });
    });

  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }
}
