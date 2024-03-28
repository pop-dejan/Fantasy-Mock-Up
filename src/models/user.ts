import { Gameweek } from "./gameweek";
import { Player } from "./players";

export class User {
  _id: string;
  goalkeeper: Player[];
  defence: Player[];
  midfield: Player[];
  attack: Player[];
  subs: Player[];
  clubs: string[];
  countPlayers: number;
  money: number;
  squadName: string;
  freeTransfers: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  countryOfOrigin: string;
  countryCode: string;
  favouriteClub: string;
  email: string;
  addedSquad: boolean;
  signInProviders: boolean;
  gameweeks: Gameweek[];
  countTransfers: number;
  cost: number;
  overallRank: number;
  gameweekTransfers: string[][];

  constructor(obj?: any) {
    this._id = (obj && obj._id) || "";
    this.goalkeeper = obj && obj.goalkeeper && obj.goalkeeper.map((elem: any) => new Player(elem)) || [];
    this.defence = obj && obj.defence && obj.defence.map((elem: any) => new Player(elem)) || [];
    this.midfield = obj && obj.midfield && obj.midfield.map((elem: any) => new Player(elem)) || [];
    this.attack = obj && obj.attack && obj.attack.map((elem: any) => new Player(elem)) || [];
    this.subs = obj && obj.subs && obj.subs.map((elem: any) => new Player(elem)) || [];
    this.clubs = obj && obj.clubs || [];
    this.countPlayers = (obj && obj.countPlayers) || 0;
    this.money = (obj && obj.money) || 100;
    this.squadName = (obj && obj.squadName) || "";
    this.freeTransfers = (obj && obj.freeTransfers) || 0;
    this.firstName = (obj && obj.firstName) || "";
    this.lastName = (obj && obj.lastName) || "";
    this.gender = (obj && obj.gender) || "";
    this.dateOfBirth = (obj && obj.dateOfBirth) || "";
    this.countryOfOrigin = (obj && obj.countryOfOrigin) || "";
    this.countryCode = (obj && obj.countryCode) || "";
    this.favouriteClub = (obj && obj.favouriteClub) || "";
    this.email = (obj && obj.email) || "";
    this.addedSquad = (obj && obj.addedSquad) || false;
    this.signInProviders = (obj && obj.signInProviders) || false;
    this.gameweeks = obj && obj.gameweeks && obj.gameweeks.map((elem: any) => new Gameweek(elem)) || [];
    this.countTransfers = (obj && obj.countTransfers) || 0;
    this.cost = (obj && obj.cost) || 0;
    this.overallRank = (obj && obj.overallRank) || 0;
    this.gameweekTransfers = obj && obj.gameweekTransfers && obj.gameweekTransfers.map((elem: string[]) => elem.map(str => str)) || [];
  }
}

