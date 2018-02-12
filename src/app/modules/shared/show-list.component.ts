import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { TVMaze } from './tv-maze.provider';
import { LocalStorage } from './local-storage.provider';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Show, Episode } from './../../interfaces';
import { SortableHeader } from './sortable-header.directive';
import { OrderByDirection } from './order-by.pipe';

@Component({
  selector: 'mwl-show-list',
  template: `
    <table class="table" [hidden]="!shows || shows.length === 0">
      <thead>
        <tr>
          <th mwlSortableHeader="name" [sort]="sort">Name</th>
          <th>Image</th>
          <th mwlSortableHeader="network.name" [sort]="sort">Network</th>
          <th>Summary</th>
          <th mwlSortableHeader="status" [sort]="sort">Status</th>
          <th mwlSortableHeader="nextEpisode.airstamp" [sort]="sort">Next episode</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let show of shows | mwlOrderBy:sort.field:sort.direction" [hidden]="!show.image?.medium">
          <td>{{ show.name }}</td>
          <td>
            <img [src]="show.image?.medium | mwlReplace:'http://':'https://'" width="60">
          </td>
          <td>{{ show.network?.name }}</td>
          <td [innerHtml]="show.summary"></td>
          <td>
            <span
              class="badge"
              [class.badge-success]="show.status === 'Running'"
              [class.badge-danger]="show.status !== 'Running'">
               {{ show.status }}
             </span>
          </td>
          <td>
            <span [hidden]="!show?.nextEpisode?.airstamp">{{ show?.nextEpisode?.airstamp | date:'fullDate' }}</span>
            <span [hidden]="show?.nextEpisode?.airstamp">Unknown</span>
          </td>
          <td style="width: 270px">
            <button class="btn btn-success" (click)="subscribe(show)" [hidden]="isSubscribed(show)">
              Subscribe
            </button>
            <button
              class="btn btn-danger"
              [hidden]="!isSubscribed(show)"
              mwlConfirmationPopover
              popoverTitle="Unsubscribe"
              popoverMessage="Are you sure you would like to unsubscribe from this show?"
              (confirm)="unsubscribeFromShow(show)">
              Unsubscribe
            </button>
            <button class="btn btn-info" [routerLink]="['/episodes', show.id]">
              Episodes
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class ShowListComponent implements OnChanges {
  @Input() shows: Show[];

  @Output() unsubscribe = new EventEmitter<Show>();

  subscribedShows: Show[];

  sort: SortableHeader = {
    field: null,
    direction: OrderByDirection.Asc
  };

  constructor(private localStorage: LocalStorage, private tvMaze: TVMaze) {
    this.subscribedShows = localStorage.getItem('subscribedShows', []);
  }

  subscribe(show: Show): void {
    this.subscribedShows.push(show);
    this.localStorage.setItem('subscribedShows', this.subscribedShows);
  }

  isSubscribed(show: Show): boolean {
    return this.subscribedShows.some(
      (subscribedShow: Show) => subscribedShow.id === show.id
    );
  }

  unsubscribeFromShow(show: Show): void {
    this.subscribedShows = this.subscribedShows.filter(
      (subscribedShow: Show) => subscribedShow.id !== show.id
    );
    this.localStorage.setItem('subscribedShows', this.subscribedShows);
    this.unsubscribe.emit(show);
  }

  ngOnChanges(changeRecord: SimpleChanges): void {
    if (changeRecord.shows && this.shows) {
      const episodeRequests = this.shows.map(show =>
        this.tvMaze.getEpisodes(show.id)
      );

      forkJoin(episodeRequests).subscribe(showEpisodes => {
        showEpisodes.forEach((episodes, showIndex) => {
          this.shows[showIndex].nextEpisode = episodes.find(episode => {
            return new Date(episode.airstamp).getTime() > Date.now();
          });
        });
      });
    }
  }
}
