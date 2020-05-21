import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'link'
})
export class LinkPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return  `${environment.host_image}/${value}`;
  }

}
