import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { Store } from '@ngxs/store';
import { ClearUserData } from 'src/app/state/app.action';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  showHeaderBol = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store) { }

  login(formData: any): Observable<any> {
    const graphqlQuery =
    {
      query: `{
          login(email: "${formData.email}", password: "${formData.password}")
        {
            token
            user {
              _id
              imageUrl
              firstName
              lastName
              displayName
              email
            }
          }
        
        }
    `};
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    return this.http.post<any>(environment.baseUrl, graphqlQuery)
      .pipe(
        map(response => {
          if (response) {
            localStorage.setItem('ACCESS_TOKEN', response.data.login.token);
          }
          return response;
        })
      );
  }

  logout() {
    this.store.dispatch(new ClearUserData());
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('USER_ID');
    localStorage.removeItem('@@STATE');
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

  upload(fileData, formData): Observable<any> {

    const imageData = new FormData();

    imageData.append('image', fileData);
    imageData.append('displayName', formData.displayName);
    imageData.append('email', formData.email);
    return this.http.post<any>(environment.imageUploadUrl, imageData);
  }

  signup(formData: any, fileData: File): Observable<any> {

    return this.upload(fileData, formData).pipe(
      switchMap(res => {
        let graphqlQuery =
        {
          query:
            `mutation {
            createUser(userInput: {
              email: "${formData.email}", 
              firstName: "${formData.firstName}", 
              lastName: "${formData.lastName}", 
              displayName: "${formData.displayName}", 
              password: "${formData.password}",
              confirmPassword: "${formData.confirmPassword}",
              imageUrl: "${res.filePath}"}){
              _id
              email
            }
          }`
        };
        return this.http.post<any>(environment.baseUrl, graphqlQuery);
      })
    );

  }
}
