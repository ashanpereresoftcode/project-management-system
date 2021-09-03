import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BlockUIModule } from 'ng-block-ui';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BlockUIModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
