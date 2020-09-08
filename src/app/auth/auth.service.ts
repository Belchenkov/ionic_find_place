import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuth = true;
  private _userId = 'xyz';

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
    return this.http.post(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
            environment.firebaseAPIKey
        }`,
        { email, password, returnSecureToken: true }
    );
  }

  login() {
    this._userIsAuth = true;
  }

  logout() {
    this._userIsAuth = false;
  }
}
