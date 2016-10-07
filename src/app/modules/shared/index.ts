import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpModule} from '@angular/http';
import {ConfirmModule} from 'angular2-bootstrap-confirm';
import {OrderBy} from './orderBy.pipe';
import {SortableHeader} from './sortableHeader.directive';
import {LocalStorage} from './localStorage.provider';
import {TVMaze} from './tvMaze.provider';
import {ShowList} from './showList.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfirmModule,
    HttpModule
  ],
  declarations: [
    OrderBy,
    SortableHeader,
    ShowList
  ],
  exports: [
    OrderBy,
    SortableHeader,
    ShowList,
    CommonModule
  ],
  providers: [ // if these held any state they should be instantiated by the root module
    LocalStorage,
    TVMaze
  ]
})
export class SharedModule {}