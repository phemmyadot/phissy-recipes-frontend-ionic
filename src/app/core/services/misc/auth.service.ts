import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Authentication } from '../../models/auth';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  showHeaderBol = new Subject<boolean>();
  showTabsBol = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  login(formData: any) {
    // const body = new URLSearchParams();
    // body.set('username', formData.username);
    // body.set('password', formData.password);
    const graphqlQuery =
    {
      query: `{
          login(email: "${formData.username}", password: "${formData.password}")
        {
            token
            userId
          }
        
        }
    `};
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post(environment.baseUrl, graphqlQuery)
      .pipe(
        map((response: any) => {
          if (response) {
            localStorage.setItem('ACCESS_TOKEN', response.data.login.token);
            localStorage.setItem('USER_ID', response.data.login.userId);
          }
        })
      )
  }

  logout() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_ID');
    this.router.navigateByUrl('/auth');
  }

  isAuthenticated(): Observable<boolean> {
    const isAuth = !!localStorage.getItem('ACCESS_TOKEN');
    return of(isAuth);
  }

  getAccessToken() {
    return localStorage.getItem('ACCESS_TOKEN');
  }

  showHeader(value) {
    this.showHeaderBol.next(value);
  }

  showTabs(value) {
    this.showTabsBol.next(value);
  }
}
