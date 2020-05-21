import { Pipe, PipeTransform } from '@angular/core';
import { TimeService } from 'src/app/shared/services/helpers/time.service';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  constructor(
    private timeservice: TimeService
  ) { }
  transform(value: any, args: string): any {
    if (args && value) {
      return this.timeservice.getTimeFormatFromDate(value, args);
    }
    else {
      return value ? new Date(value).toLocaleString() : '';
    }
  }

}
