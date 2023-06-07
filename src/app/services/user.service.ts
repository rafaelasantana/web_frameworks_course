import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private username = '';

  setUsername(username: string) {
    this.username = username;
  }

  getUsername() {
    return this.username;
  }

  deleteUser() {
    this.username = '';
  }
}
