import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private snackbar: MatSnackBar) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authService.isLoggedIn()) {
        this.router.navigate(['']);
        return false;
      }

      /* console.log(!this.authService.isAdmin())
      if(!this.authService.isAdmin()){
        this.router.navigate(['']);
        var message = "GARDIEN n'autorise pas la navigation, vous n'êtes pas admin";
        this.snackbar.open(message, '',  {
          duration : 4000,
          verticalPosition: 'top',
          panelClass: ['mat-toolbar', 'mat-primary']
        });
        return false;
      }*/

      return true;
  }

}
