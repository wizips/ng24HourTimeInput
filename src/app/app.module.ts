import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Ng24HourTimeInputModule } from 'ng24-hour-time-input';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng24HourTimeInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
