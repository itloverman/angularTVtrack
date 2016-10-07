import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import {LocalStorage} from '../shared/localStorage.provider';
import {TVMaze} from '../shared/tvMaze.provider';
import {Show, Episode, ShowWithEpisodes} from '../../interfaces';

@Injectable()
export class EpisodesResolver implements Resolve<ShowWithEpisodes[]> {

  subscribedShows: Show[];

  constructor(private localStorage: LocalStorage, private tvMaze: TVMaze) {
    this.subscribedShows = localStorage.getItem('subscribedShows', []);
  }

  resolve(): Observable<ShowWithEpisodes[]> {

    const episodeRequests: Observable<ShowWithEpisodes>[] = this.subscribedShows.map((show: Show) => {
      return this.tvMaze.getEpisodes(show.id).map((episodes: Episode[]): ShowWithEpisodes => {
        return {episodes, show};
      });
    });

    return Observable.forkJoin(episodeRequests);

  }

}