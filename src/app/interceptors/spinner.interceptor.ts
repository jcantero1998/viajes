import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const hasNextPageToken = req.body && req.body.pageToken;
    if (!hasNextPageToken) {
      this.spinnerService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!hasNextPageToken) {
          this.spinnerService.hide();
        }
      })
    );
  }
}
