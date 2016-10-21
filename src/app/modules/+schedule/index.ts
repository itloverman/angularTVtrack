import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'angular2-calendar';
import { ScheduleCalendarComponent } from './schedule.component';
import { SubscribedShowsEpisodesResolver } from './subscribedShowsEpisodes.resolver';
import { SharedModule } from './../shared';

@NgModule({
  declarations: [
    ScheduleCalendarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: ScheduleCalendarComponent,
        resolve: {
          subscribedShowsWithEpisodes: SubscribedShowsEpisodesResolver
        }
      }
    ])
  ],
  providers: [SubscribedShowsEpisodesResolver]
})
export class ScheduleModule {}