import { Directive, ElementRef, HostListener } from '@angular/core';
enum EGroup {
  hours = 'hours',
  minutes = 'minutes',
}
@Directive({
  selector: 'input[type="text"][ng24HourTimeInput]',
})
export class Ng24HourTimeInputDirective {
  private get activeGroup(): EGroup {
    if (this.nativeElement.selectionStart <= 2) {
      return EGroup.hours;
    } else {
      return EGroup.minutes;
    }
  }

  private get nativeElement(): HTMLInputElement {
    return this.elm.nativeElement as HTMLInputElement;
  }

  private get hoursAsString(): string {
    return this.nativeElement.value[0] + this.nativeElement.value[1];
  }

  private get hoursAsNumber(): number {
    return parseInt(this.hoursAsString, 10);
  }

  private get minutesAsString(): string {
    return this.nativeElement.value[3] + this.nativeElement.value[4];
  }

  private get minutesAsNumber(): number {
    return parseInt(this.minutesAsString, 10);
  }

  private firstInput = true;

  constructor(private elm: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeypress(event: KeyboardEvent) {
    const value = this.nativeElement.value || '00:00';
    const key = event.key;
    switch (key) {
      case 'Backspace':
      case 'Delete':
        event.preventDefault();
        if (this.activeGroup === EGroup.hours) {
          this.setNullValue();
        } else {
          this.setMinutes('00');
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.increase();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.decrease();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.firstInput = true;
        this.focusHour();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.firstInput = true;
        this.focusMinutes();
        break;
      case 'Tab':
        if (this.activeGroup === EGroup.hours) {
          event.preventDefault();
          this.firstInput = true;
          this.focusMinutes();
        }
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        event.preventDefault();
        if (this.activeGroup === EGroup.hours) {
          if (this.firstInput) {
            this.setHour('0' + key);

            if (['0', '1', '2'].includes(key)) {
              this.firstInput = false;
              this.focusHour();
            } else {
              this.firstInput = true;
              this.focusMinutes();
            }
          } else {
            if (this.isValidHours(value[1] + key)) {
              this.setHour(value[1] + key);
            } else {
              this.setHour('0' + key);
            }

            this.firstInput = true;
            this.focusMinutes();
          }
        } else {
          if (this.firstInput) {
            this.setMinutes('0' + key);

            if (['0', '1', '2', '3', '4', '5'].includes(key)) {
              this.firstInput = false;
            } else {
              this.firstInput = true;
            }
            this.focusMinutes();
          } else {
            if (this.isValidMinutes(value[4] + key)) {
              this.setMinutes(value[4] + key);
            } else {
              this.setMinutes('0' + key);
            }

            this.firstInput = true;
            this.focusMinutes();
          }
        }
        break;
      default:
        event.preventDefault();
        break;
    }
  }

  @HostListener('focus')
  onFocus() {
    this.onClick();
  }

  @HostListener('click', ['$event'])
  onClick() {
    this.firstInput = true;
    this.setFocus();
  }

  @HostListener('blur')
  onBlur() {
    if (!this.isValidTime()) {
      this.setNullValue();
    }
  }

  private focusHour() {
    this.nativeElement.setSelectionRange(0, 2);
  }

  private focusMinutes() {
    this.nativeElement.setSelectionRange(3, 5);
  }

  private increase() {
    if (this.activeGroup === EGroup.hours) {
      const increasedValue = this.hoursAsNumber + 1;
      if (increasedValue < 24) {
        this.setHour(increasedValue);
      } else {
        this.setHour('00');
      }
      this.focusHour();
    } else {
      const increasedValue = this.minutesAsNumber + 1;
      if (increasedValue < 60) {
        this.setMinutes(increasedValue);
      } else {
        this.setMinutes('00');
      }
      this.focusMinutes();
    }
  }

  private decrease() {
    if (this.activeGroup === EGroup.hours) {
      const decreasedValue = this.hoursAsNumber - 1;
      if (decreasedValue < 0) {
        this.setHour('23');
      } else {
        this.setHour(decreasedValue);
      }
      this.focusHour();
    } else {
      const decreasedValue = this.minutesAsNumber - 1;
      if (decreasedValue < 0) {
        this.setMinutes('59');
      } else {
        this.setMinutes(decreasedValue);
      }
      this.focusMinutes();
    }
  }

  private setFocus() {
    if (this.activeGroup === EGroup.hours) {
      this.focusHour();
    } else {
      this.focusMinutes();
    }
  }

  private setHour(value: string | number) {
    if (typeof value === 'number') {
      value = value < 10 ? `0${value}` : (`${value}` as string);
    }
    if (this.nativeElement.value.length === 2) {
      this.nativeElement.value = this.nativeElement.value + ':' + '00';
    }
    this.nativeElement.value = value + ':' + this.minutesAsString;
    this.nativeElement.dispatchEvent(new Event('input'));
  }

  private setMinutes(value: string | number) {
    if (typeof value === 'number') {
      value = value < 10 ? `0${value}` : (`${value}` as string);
    }
    this.nativeElement.value = this.hoursAsString + ':' + value;
    this.nativeElement.dispatchEvent(new Event('input'));
  }

  private setNullValue() {
    this.nativeElement.value = null;
    this.nativeElement.dispatchEvent(new Event('input'));
  }

  private isValidHours(value: string): boolean {
    return /^[0-1]{1}[0-9]{1}|20|21|22|23$/.test(value);
  }

  private isValidMinutes(value: string): boolean {
    return /^[0-5]{1}[0-9]{1}$/.test(value);
  }

  private isValidTime(): boolean {
    return (
      this.nativeElement.value &&
      this.isValidHours(this.hoursAsString) &&
      this.nativeElement.value[2] === ':' &&
      this.isValidMinutes(this.minutesAsString)
    );
  }
}
