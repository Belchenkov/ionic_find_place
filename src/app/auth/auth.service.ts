import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

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
  private _userIsAuth = false;
  private _userId = null;

  constructor(
      private http: HttpClient
  ) { }

  get userIsAuth() {
    return this._userIsAuth;
  }

  get userId() {
    return this._userId;
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
            environment.firebaseAPIKey
        }`,
        { email, password, returnSecureToken: true }
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
            environment.firebaseAPIKey
        }`,
        { email, password, returnSecureToken: true }
    );
  }

  logout() {
    this._userIsAuth = false;
  }
}
