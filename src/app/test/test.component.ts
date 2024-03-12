import { Component, OnInit } from '@angular/core';
import { Player } from '../models/players';
import { FantasyService } from '../service/fantasy.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  players: Player[] = [];

  constructor(private service: FantasyService) {}

  ngOnInit(): void {
    this.getPlayers();
  }

  getPlayers() {
    this.service.getPlayers().subscribe({
      next: (response: any) => {
        this.players = response;
        console.log(this.players);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
