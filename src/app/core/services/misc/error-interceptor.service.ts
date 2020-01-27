import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';


@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log('error', error);
                return throwError(error);
            })
        )
    }
}