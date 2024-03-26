export class Player {
  kit_src: string;
  name: string;
  club: string;
  position: string;
  add: boolean;
  remove: boolean;
  set: boolean;
  captain: boolean;
  price: number;
  points: number;
  playerGameweeks: PlayerGameweeks[];

  constructor(obj?: any) {
    this.kit_src = (obj && obj.kit_src) || '';
    this.name = (obj && obj.name) || '';
    this.club = (obj && obj.club) || '';
    this.position = (obj && obj.position) || '';
    this.price = (obj && obj.price) || 0;
    this.points = (obj && obj.points) || 0;
    this.add = (obj && obj.add) || false;
    this.remove = (obj && obj.remove) || false;
    this.set = (obj && obj.set) || false;
    this.captain = (obj && obj.captain) || false;
  }
}

class PlayerGameweeks {
  gameweekNumber: number;
  gameweekPoints: number;

  constructor(obj?: any) {
    this.gameweekNumber = (obj && obj.gameweekNumber) || 0;
    this.gameweekPoints = (obj && obj.gameweekPoints) || 0;
  }
}
