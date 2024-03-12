import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Player } from '../models/players';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class FantasyService {
  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player> {
    return this.http
      .get(
        'https://fantasy-89c4e-default-rtdb.europe-west1.firebasedatabase.app/players.json'
      )
      .pipe(
        map((data: any) => {
          return data.map((elem: any) => new Player(elem));
        })
      );
  }

  getUser(): Observable<User> {
    return this.http
      .get(
        'https://fantasy-89c4e-default-rtdb.europe-west1.firebasedatabase.app/users.json'
      )
      .pipe(
        map((data: any) => {
          return data.map((elem: any) => new User(elem));
        })
      );
  }
}
