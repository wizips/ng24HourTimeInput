import { NgModule } from '@angular/core';
import { Ng24HourTimeInputDirective } from './ng24-hour-time-input.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [Ng24HourTimeInputDirective],
  imports: [CommonModule],
  exports: [Ng24HourTimeInputDirective],
})
export class Ng24HourTimeInputModule {}
