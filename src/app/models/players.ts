export class Player {
  kit_src: string;
  name: string;
  club: string;
  position: string;
  switch: string;

  constructor(obj?: any) {
    this.kit_src = (obj && obj.kit_src) || '';
    this.name = (obj && obj.name) || '';
    this.club = (obj && obj.club) || '';
    this.position = (obj && obj.position) || '';
    this.switch = (obj && obj.switch) || '';
  }
}
