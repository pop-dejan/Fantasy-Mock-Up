import { Player } from './players';

export class User {
  _id: number;
  goalkeeper: Player[];
  defence: Player[];
  midfield: Player[];
  attack: Player[];
  subs: Player[];
  players: Player[];

  constructor(obj?: any) {
    this._id = (obj && obj._id) || 0;
    this.goalkeeper =
      (obj &&
        obj.goalkeeper &&
        obj.goalkeeper.map((elem: any) => new Player(elem))) ||
      [];
    this.defence =
      (obj &&
        obj.defence &&
        obj.defence.map((elem: any) => new Player(elem))) ||
      [];
    this.midfield =
      (obj &&
        obj.midfield &&
        obj.midfield.map((elem: any) => new Player(elem))) ||
      [];
    this.attack =
      (obj && obj.attack && obj.attack.map((elem: any) => new Player(elem))) ||
      [];
    this.subs =
      (obj && obj.subs && obj.subs.map((elem: any) => new Player(elem))) || [];
    this.players =
      (obj &&
        obj.players &&
        obj.players.map((elem: any) => new Player(elem))) ||
      [];
  }
}
