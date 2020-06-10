import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuth = false;

  constructor() { }

  get userIsAuth() {
    return this._userIsAuth;
  }

  login() {
    this._userIsAuth = true;
  }

  logout() {
    this._userIsAuth = false;
  }
}
