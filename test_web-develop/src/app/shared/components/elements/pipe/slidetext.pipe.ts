import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'slicetext' })
export class SlideTextPipe implements PipeTransform {
  transform(text: string, num?: number) {
    if (!text) {
      text = ' ';
    }
    return text.length !== 0 ? (text.substr(0, num - 1) + (text.length > num ? ' ...' : '')) : '';
  }
}

