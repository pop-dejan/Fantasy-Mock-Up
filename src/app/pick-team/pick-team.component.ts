import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FantasyService } from '../service/fantasy.service';
import { User } from '../models/user';
import { Player } from '../models/players';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pick-team',
  templateUrl: './pick-team.component.html',
  styleUrls: ['./pick-team.component.scss'],
})
export class PickTeamComponent implements OnInit {
  players: Player[] = [];
  user: User[] = [];

  constructor(
    private service: FantasyService,
    private el: ElementRef,
    private renderer: Renderer2,
    private modalService: NgbModal
  ) { }

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
        console.log(this.user);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openModal(content: any) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        centered: true,
        animation: false,
      })
      .result.then(
        (result) => { },
        (reason) => { }
      );
  }

  function(player: Player, element: any) {
    let players = this.el.nativeElement.querySelectorAll('.player');
    let subs = this.el.nativeElement.querySelectorAll('.subs .player');

    if (this.user[0].goalkeeper.includes(player)) {
      players.forEach((player: any) =>
        this.renderer.setStyle(player, 'opacity', '0.6')
      );

      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(
        element,
        'background-color',
        'rgba(255, 255, 0, 0.6)'
      );
      let subsGoalkeeper: any;
      for (let i = 0; i < this.user[0].subs.length; i++) {
        if (this.user[0].subs[i].position === 'gkp') {
          subsGoalkeeper = this.user[0].subs[i];
        }
      }
      for (let i = 0; i < subs.length; i++) {
        if (subs[i].id === subsGoalkeeper.name) {
          this.renderer.setStyle(subs[i], 'opacity', '1');
          this.renderer.setStyle(
            subs[i],
            'background-color',
            'rgba(255, 102, 0, 0.6)'
          );
        }
      }
    } else if (this.user[0].defence.includes(player)) {
      console.log('defanzivac');
    } else if (this.user[0].midfield.includes(player)) {
      console.log('sredina');
    } else if (this.user[0].attack.includes(player)) {
      console.log('napad');
    } else if (this.user[0].subs.includes(player)) {
      console.log('izmena');
    }
  }
}
