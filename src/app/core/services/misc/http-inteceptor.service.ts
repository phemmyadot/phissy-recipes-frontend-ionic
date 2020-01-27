import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

    constructor(private auth: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return from(this.processInterceptor(req, next));

    }

    private async processInterceptor(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        let changedRequest: HttpRequest<any> = req;
        if (!req.url.includes('auth') || !req.url.includes('signup')) {
            const token = this.auth.getAccessToken();
            if (token) {
                if (req.method === 'GET') { // for IE
                    changedRequest = req.clone({
                        headers: req.headers.set('Cache-Control', 'no-cache')
                            .set('Pragma', 'no-cache')
                            .set('Content-Type', 'application/json')
                            .set('Authorization', `Bearer ${token}`)
                    });
                } else {
                    changedRequest = req.clone({
                        headers: req.headers.set('Content-Type', 'application/json')
                            .set('Authorization', `Bearer ${token}`)
                    });
                }

            }
        }
        return next.handle(changedRequest).toPromise()
    }
}
