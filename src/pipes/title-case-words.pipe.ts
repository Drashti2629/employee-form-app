import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'titleCaseWords',
  standalone: true
})
@Injectable({ providedIn: 'root' })  
export class TitleCaseWordsPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
