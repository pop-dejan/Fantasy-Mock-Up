import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Player } from '../models/players';
import { FantasyService } from '../service/fantasy.service';
import { User } from '../models/user';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  players: Player[] = [];
  user: User[] = [];

  constructor(private service: FantasyService, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getPlayers();
    this.getUser();
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

  getUser() {
    this.service.getUser().subscribe({
      next: (response: any) => {
        this.user = response;
        if (this.user[0].defence.length === 3) {
          let defence = this.el.nativeElement.querySelector('.defence');
          this.renderer.setStyle(defence, 'justify-content', 'space-around');
        }
        if (this.user[0].midfield.length === 3) {
          let midfield = this.el.nativeElement.querySelector('.midfield');
          this.renderer.setStyle(midfield, 'justify-content', 'space-around');
        }
        console.log(this.user)
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
