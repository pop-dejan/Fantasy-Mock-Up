import { Player } from "./players";

export class Gameweek {
    gameweekNumber: number;
    gameweekTransfersCount: number;
    gameweekCostCount: number;
    gameweekRank: number;
    finalPoints: number;
    goalkeeper: Player[];
    defence: Player[];
    midfield: Player[];
    attack: Player[];
    subs: Player[];
    gameweekTransfers: string[][];

    constructor(obj?: any) {
        this.gameweekNumber = (obj && obj.gameweekNumber) || 0;
        this.gameweekTransfersCount = (obj && obj.gameweekTransfersCount) || 0;
        this.gameweekCostCount = (obj && obj.gameweekCostCount) || 0;
        this.gameweekRank = (obj && obj.gameweekRank) || 0;
        this.finalPoints = (obj && obj.finalPoints) || 0;
        this.goalkeeper = obj && obj.goalkeeper && obj.goalkeeper.map((elem: any) => new Player(elem)) || [];
        this.defence = obj && obj.defence && obj.defence.map((elem: any) => new Player(elem)) || [];
        this.midfield = obj && obj.midfield && obj.midfield.map((elem: any) => new Player(elem)) || [];
        this.attack = obj && obj.attack && obj.attack.map((elem: any) => new Player(elem)) || [];
        this.subs = obj && obj.subs && obj.subs.map((elem: any) => new Player(elem)) || [];
        this.gameweekTransfers = obj && obj.gameweekTransfers && obj.gameweekTransfers.map((elem: string[]) => elem.map(str => str)) || [];
    }
}