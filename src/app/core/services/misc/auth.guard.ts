import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private router: Router, private authService: AuthService) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    let response;
    this.authService.isAuthenticated().subscribe(res => {
      if (res) {
        response = res;
        return true;
      } else {
        this.router.navigate(['/auth']);
        return false;
      }
    })
    return response;
  }
}
