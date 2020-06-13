import { Injectable } from '@angular/core';
import {
  CanLoad,
  Route,
  Router,
  UrlSegment
} from '@angular/router';
import { Observable } from 'rxjs';

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
    if (!this.authService.userIsAuth) {
      return this.router.navigate(['/auth']);
    }
    return this.authService.userIsAuth;
  }
}
