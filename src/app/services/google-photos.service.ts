import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GooglePhotosService {
  private readonly API_URL = 'https://photoslibrary.googleapis.com/v1';

  constructor(private http: HttpClient, private oAuthService: OAuthService) {}

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    return headers;
  }

  private getAuthorizationHeader(): HttpHeaders {
    const token = this.oAuthService.getAccessToken();
    return this.getHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Método para obtener las fotos de todos los albumes de google fotos de la persona que ha iniciado sesión usando onAuth 2.0.
  getAlbums(): Observable<any> {
    const url = `${this.API_URL}/albums`;
    const headers = this.getAuthorizationHeader();
    return this.http.get(url, { headers });
  }

  // Método para obtener álbumes compartidos por el usuario jcantero1998@gmail.com
  getSharedAlbumsForUser(): Observable<any> {
    const url = `${this.API_URL}/sharedAlbums`;
    const headers = this.getAuthorizationHeader();
    return this.http.get(url, { headers });
  }

  // Método para obtener las fotos de un álbum específico.
  getPhotosFromAlbum(albumId: string): Observable<any> {
    const url = `${this.API_URL}/mediaItems:search`;
    const headers = this.getAuthorizationHeader();
    const body = { albumId };
    return this.http.post(url, body, { headers });
  }
}
