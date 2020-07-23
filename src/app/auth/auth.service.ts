import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuth = true;
  private _userId = 'abc';

  constructor() { }

  get userIsAuth() {
    return this._userIsAuth;
  }

  get userId() {
    return this._userId;
  }

  login() {
    this._userIsAuth = true;
  }

  logout() {
    this._userIsAuth = false;
  }
}
