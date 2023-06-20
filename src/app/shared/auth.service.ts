import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  myurl: string = environment.myurl;
  constructor(
    private http: HttpClient,
  ) { }

  public login(login: any) {
    const data = this.http.post(this.myurl + "/utilisateur/login", login);
    return data;
  }

  setToken(token:string) {
    localStorage.setItem('access_token', token);
  }

  setUtilisateur(user:any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  setInformation(data:any){
    this.setToken(data.token);
    this.setUtilisateur(data.user);
  }

  isAdmin() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.isAdmin;
  }

  getToken():any {
    return localStorage.getItem("access_token");
  }

  isLoggedIn() {
    return this.getToken() != null;
  }
  destroyToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profil');
    localStorage.clear();
  }
}