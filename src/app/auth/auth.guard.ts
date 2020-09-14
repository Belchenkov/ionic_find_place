import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(
      private authService: AuthService,
      private router: Router
  ) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.userIsAuth
          .pipe(
              take(1),
              switchMap(isAuth => {
                  if (!isAuth) {
                      return this.authService.autoLogin();
                  }
              }),
              tap(isAuth => {
                if (!isAuth) {
                  return this.router.navigate(['/auth']);
                }
              })
          );
  }
}
