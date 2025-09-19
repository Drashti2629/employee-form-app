import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleCaseWords',
  standalone: true // 👈 optional, if you're using standalone components
})
export class TitleCaseWordsPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    return value
      .toString()
      .split(/\s+/)                  // split by spaces
      .filter(Boolean)               // remove empty parts
      .map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }
}
