/// <reference types="tinycolor" />

import { Component } from '@angular/core';
import { CalendarEvent } from 'angular2-calendar';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/map';
import randomColor from 'randomcolor';
import tinycolor from 'tinycolor2';
import format from 'date-fns/format';
import subDays from 'date-fns/sub_days';
import addDays from 'date-fns/add_days';
import isSameDay from 'date-fns/is_same_day';
import isSameMonth from 'date-fns/is_same_month';
import addWeeks from 'date-fns/add_weeks';
import subWeeks from 'date-fns/sub_weeks';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import { Episode, ShowWithEpisodes } from './../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

interface EpisodeCalendarEvent extends CalendarEvent {
  episode: Episode;
}

const padNumber: Function = (number: number): string => number < 10 ? `0${number}` : number + '';

@Component({
  template: `
    <div>
      <div class="row">
        <div class="col-md-4">
          <div class="btn-group">
            <div class="btn btn-primary" (click)="decrement()">
              Previous
            </div>
            <div class="btn btn-secondary" (click)="today()">
              Today
            </div>
            <div class="btn btn-primary" (click)="increment()">
              Next
            </div>
          </div>
        </div>
        <div class="col-md-4 text-xs-center">
          <h3>{{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}</h3>
        </div>
        <div class="col-md-4 text-xs-right">
          <div class="btn-group">
            <div class="btn btn-primary" (click)="view = 'month'" [class.active]="view === 'month'">Month</div>
            <div class="btn btn-primary" (click)="view = 'week'" [class.active]="view === 'week'">Week</div>
            <div class="btn btn-primary" (click)="view = 'day'" [class.active]="view === 'day'">Day</div>
          </div>
        </div>
      </div>
      <br>
      <div [ngSwitch]="view">
        <mwl-calendar-month-view
          *ngSwitchCase="'month'"
          [viewDate]="viewDate"
          [events]="events | async"
          [activeDayIsOpen]="activeDayIsOpen"
          (dayClicked)="dayClicked($event.day)"
          (eventClicked)="openEpisode($event.event)">
        </mwl-calendar-month-view>
        <mwl-calendar-week-view
          *ngSwitchCase="'week'"
          [viewDate]="viewDate"
          [events]="events | async"
          (eventClicked)="openEpisode($event.event)">
        </mwl-calendar-week-view>
        <mwl-calendar-day-view
          *ngSwitchCase="'day'"
          [viewDate]="viewDate"
          [events]="events | async"
          (eventClicked)="openEpisode($event.event)">
        </mwl-calendar-day-view>
      </div>
    </div>
    <br><br>
  `
})
export class ScheduleCalendarComponent {

  view: string = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  events: Observable<{}>;

  constructor(route: ActivatedRoute) {
    this.events = route.data.pluck('subscribedShowsWithEpisodes').map((showsWithEpisodes: ShowWithEpisodes[]) => {

      const events: EpisodeCalendarEvent[] = [];

      showsWithEpisodes.forEach(({episodes, show}: ShowWithEpisodes) => {
        episodes.forEach((episode: Episode) => {

          const color: any = {};
          color.primary = randomColor({
            luminosity: 'dark',
            seed: show.id
          });
          color.secondary = tinycolor(color.primary).lighten(50).toString();

          events.push({
            title: `
              ${format(episode.airstamp, 'h:mma')} - ${show.name} 
              S${padNumber(episode.season)}E${padNumber(episode.number)} - ${episode.name}
            `,
            start: new Date(episode.airstamp),
            color,
            episode
          });

        });

      });

      return events;

    });
  }

  increment(): void {

    const addFn: any = {
      day: addDays,
      week: addWeeks,
      month: addMonths
    }[this.view];

    this.viewDate = addFn(this.viewDate, 1);

  }

  decrement(): void {

    const subFn: any = {
      day: subDays,
      week: subWeeks,
      month: subMonths
    }[this.view];

    this.viewDate = subFn(this.viewDate, 1);

  }

  today(): void {
    this.viewDate = new Date();
  }

  dayClicked({date, events}: {date: Date, events: CalendarEvent[]}): void {

    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  openEpisode(event: EpisodeCalendarEvent): void {
    window.open(event.episode.url, '_blank');
  }

}