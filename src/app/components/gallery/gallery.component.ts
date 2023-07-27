import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription, firstValueFrom} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {MediaChange, MediaObserver} from '@angular/flex-layout';
import {GalleryService} from '../../services/gallery.service';
import {GalleryModalComponent} from '../gallery-modal/gallery-modal.component';
import {filter, map} from 'rxjs/operators';
import {GalleryImage} from '../../model/gallery-image';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {

  @Input() ruta!: string;
  subscription: Subscription[] = [];
  columns = 5;
  gallery: GalleryImage[] = [];

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public galleryService: GalleryService,
    public mediaObserver: MediaObserver
  ) {
  }

  ngOnInit(): void {
    this.createGallery(this.ruta);
    this.mediaChange();
  }

  async createGallery(ruta: string) {
    try {
      const data = await firstValueFrom(this.getIndex(ruta + 'index.json'));
      for (let i = 0; i < data.length; i++) {
        this.gallery.push(
          {
            src: `${ruta}${i}.jpg`,
            position: i,
            alt: `Image ${i}`,
            first: (i === 0),
            last: (i === data.length -1)
          });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  getIndex(index: string): Observable<any> {
    return this.http.get<any>(index);
  }

  openDialog(position: number): void {
    if (position >= 0 && position < this.gallery.length) {
      this.galleryService.selectImage(this.gallery, position);
    }
    this.dialog.open(GalleryModalComponent, {panelClass: 'custom-dialog-container'});
  }

  private mediaChange(): void {
    this.subscription.push(
      this.mediaObserver.asObservable()
        .pipe(
          filter((changes: MediaChange[]) => changes.length > 0),
          map((changes: MediaChange[]) => changes[0])
        ).subscribe((change: MediaChange) => {
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

  ngOnDestroy(): void {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }
}
