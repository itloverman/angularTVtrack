import {Component} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';

@Component({
  selector: 'app',
  template: `
    <nav class="navbar navbar-fixed-top navbar-light bg-faded">
      <div class="container">
        <h1 class="navbar-brand">Angular 2 TV tracker</h1>
        <ul class="nav navbar-nav">
          <li class="nav-item" routerLinkActive="active">
            <a class="nav-link" [routerLink]="['/subscribed']">Subscribed shows</a>
          </li>
          <li class="nav-item" routerLinkActive="active">
            <a class="nav-link" [routerLink]="['/schedule']">Schedule</a>
          </li>
          <li class="nav-item" routerLinkActive="active">
            <a class="nav-link" [routerLink]="['/search']">Add shows</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container content">
      <div class="loading" *ngIf="loading">
        <h1 class="text-xs-center">
          <i class="fa fa-spin fa-spinner"></i>
        </h1>
      </div>
      <router-outlet [hidden]="loading"></router-outlet>
    </div>
  `,
  styles: [`
    .container.content {
      padding-top: 70px;
    }
    .loading {
      height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loading i {
      font-size: 80px;
    }
  `]
})
export class AppComponent {

  loading: boolean = true;

  constructor(router: Router) {
    router.events.subscribe((event: any) => {
      this.loading = !!(event instanceof NavigationStart);
    });
  }

}