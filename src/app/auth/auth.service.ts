import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";

import { environment } from "../../environments/environment";
import { User } from "./user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  constructor(
      private http: HttpClient
  ) { }

  get userIsAuth() {
    return this._user.asObservable()
        .pipe(
            map(user => user ? !!user.token : false)
        );
  }

  get userId() {
    return this._user.asObservable()
        .pipe(
            map(user => user ? user.id : null)
        );
  }

  signup(email: string, password: string) {
    return this.http
        .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
            environment.firebaseAPIKey
        }`,
        { email, password, returnSecureToken: true }
        ).pipe(
          tap(this.setUserData.bind(this))
        );
  }

  login(email: string, password: string) {
    return this.http
        .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
            environment.firebaseAPIKey
        }`,
        { email, password, returnSecureToken: true }
        ).pipe(
            tap(this.setUserData.bind(this))
        );
  }

  logout() {
    this._user.next(null);b
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(new Date().getTime() + (+userData.expiresIn * 1000));

    this._user.next(new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
    ));
  }
}
