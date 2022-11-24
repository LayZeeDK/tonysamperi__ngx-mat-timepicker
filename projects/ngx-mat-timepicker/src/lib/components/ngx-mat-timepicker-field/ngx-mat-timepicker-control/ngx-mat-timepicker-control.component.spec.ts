import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { NgxMatTimepickerControlComponent } from './ngx-mat-timepicker-control.component';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { NgxMatTimepickerUnits } from '../../../models/ngx-mat-timepicker-units.enum';
import { NgxMatTimepickerParserPipe } from '../../../pipes/ngx-mat-timepicker-parser.pipe';
import { DateTime } from "ts-luxon";
import { NgxMatTimepickerModule } from '../../../ngx-mat-timepicker.module';
import { NgxMatTimepickerTimeFormatterPipe } from '../../../pipes/ngx-mat-timepicker-time-formatter.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('NgxMatTimepickerControlComponent', () => {
    let fixture: ComponentFixture<NgxMatTimepickerControlComponent>;
    let component: NgxMatTimepickerControlComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxMatTimepickerModule.setLocale('ar-AE'),
                NoopAnimationsModule
            ],
            providers: [
                NgxMatTimepickerParserPipe,
                NgxMatTimepickerTimeFormatterPipe
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(NgxMatTimepickerControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('increase', () => {

        beforeEach(() => {
            component.timeList = [
                {time: 1, angle: 0, disabled: false},
                {time: 2, angle: 0, disabled: false},
                {time: 3, angle: 0, disabled: true},
            ];
            component.min = 1;
            component.max = 12;
            component.disabled = false;
        });

        it('should increase time', waitForAsync(() => {
            component.time = 1;
            component.timeChanged.subscribe(t => expect(t).toBe(2));

            component.increase();
        }));

        it('should set time to min when increase time', waitForAsync(() => {
            component.time = 12;
            component.timeChanged.subscribe(t => expect(t).toBe(1));

            component.increase();
        }));

        it('should change time to the nearest available next time', waitForAsync(() => {
            component.timeList = [
                {time: 1, angle: 0},
                {time: 2, angle: 0, disabled: true},
                {time: 3, angle: 0},
            ];
            component.time = 1;
            component.timeChanged.subscribe((t) => expect(t).toBe(3));

            component.increase();
        }));

        it('should not change time when all next time is disabled', waitForAsync(() => {
            let counter = 0;
            component.time = 2;
            component.timeChanged.subscribe(() => counter++);

            component.increase();

            expect(counter).toBe(0);
        }));
    });

    describe('decrease', () => {

        beforeEach(() => {
            component.timeList = [
                {time: 1, angle: 0, disabled: false},
                {time: 2, angle: 0, disabled: true},
                {time: 3, angle: 0, disabled: false},
            ];
            component.min = 1;
            component.max = 3;
            component.disabled = false;
        });

        it('should decrease time', waitForAsync(() => {
            component.time = 2;
            component.timeChanged.subscribe(t => expect(t).toBe(1));

            component.decrease();
        }));

        it('should set time to max when decrease time', waitForAsync(() => {
            component.time = 1;
            component.timeChanged.subscribe(t => expect(t).toBe(3));

            component.decrease();
        }));

        it('should time to nearest available previous time', waitForAsync(() => {
            component.time = 3;
            component.timeChanged.subscribe((t) => expect(t).toBe(1));

            component.decrease();
        }));

        it('should not change time when all previous time is disabled', waitForAsync(() => {
            let counter = 0;
            component.timeList = [
                {time: 1, angle: 0, disabled: true},
                {time: 2, angle: 0, disabled: true},
                {time: 3, angle: 0},
            ];
            component.time = 3;
            component.timeChanged.subscribe(() => counter++);

            component.decrease();
            expect(counter).toBe(0);
        }));

        it('should not call increase or decrease if disabled true', () => {
            component.time = 1;
            component.disabled = true;

            component.increase();
            expect(component.time).toBe(1);

            component.decrease();
            expect(component.time).toBe(1);
        });
    });


    describe('changeTime', () => {
        let defaultEvent: Partial<Event>;

        beforeEach(() => {
            defaultEvent = {type: 'keypress', stopPropagation: () => null};
        });

        it('should set time to 14 when event fires with keycode 52', waitForAsync(() => {
            const event = {...defaultEvent, keyCode: 52}; // 4
            const expectedTime = 14;

            component.time = 1;
            component.min = 0;
            component.max = 59;
            component.timeChanged.subscribe(time => expect(time).toBe(expectedTime));

            component.changeTime(event);
            expect(component.time).toBe(expectedTime);
        }));

        it('should set time to 4 when provided value more than max', () => {
            const event = {...defaultEvent, keyCode: 52}; // 4
            component.time = 4;
            component.min = 1;
            component.max = 23;

            component.changeTime(event);

            expect(component.time).toBe(4);
        });

        it('should set time to 22 when provided value less than min', () => {
            const event = {...defaultEvent, keyCode: 48}; // 0
            component.time = 1;
            component.min = 22;
            component.max = 23;

            component.changeTime(event as KeyboardEvent);
            expect(component.time).toBe(22);
        });

        it('should not change time if value is NaN', () => {
            const event = {...defaultEvent, keyCode: 83}; // s
            component.time = 1;
            component.min = 1;
            component.max = 23;

            component.changeTime(event);
            expect(component.time).toBe(1);
        });
    });

    describe('onKeydown', () => {
        let defaultEvent: Partial<Event>;
        let counter: number;
        beforeEach(() => {
            counter = 0;
            defaultEvent = {preventDefault: () => counter++, type: 'keydown', stopPropagation: () => null};
            component.timeList = [
                {time: 1, angle: 0},
                {time: 2, angle: 0},
            ];
        });

        it('should increase time by 1 when key down arrow up', waitForAsync(() => {
            const event = {...defaultEvent, key: 'ArrowUp'};
            component.time = 1;
            component.timeChanged.subscribe(time => expect(time).toBe(2));
            component.onKeydown(event);
        }));

        it('should decrease time by 1 when key down arrow down', waitForAsync(() => {
            const event: KeyboardEvent = {...defaultEvent, key: 'ArrowDown'} as KeyboardEvent;
            component.time = 2;
            component.timeChanged.subscribe(time => expect(time).toBe(1));
            component.onKeydown(event);
        }));

        it('should call preventDefault and not change time', () => {
            const event = {...defaultEvent, keyCode: 70};
            component.time = 1;

            component.onKeydown(event);
            expect(counter).toBe(1);
            expect(component.time).toBe(1);
        });

        it(`should call preventDefault when preventTyping is true and event.key is not 'Tab' and not change time`, () => {
            const event = {...defaultEvent, key: 'ArrowLeft'};
            component.time = 1;
            component.preventTyping = true;

            component.onKeydown(event);
            expect(component.time).toBe(1);
            expect(counter).toBe(1);
        });

        it(`should not call preventDefault when preventTyping is true and event.key is 'Tab'`, () => {
            const event = {...defaultEvent, key: 'Tab'};
            component.preventTyping = true;

            component.onKeydown(event);
            expect(counter).toBe(0);
        });

        it(`should not call preventDefault when preventTyping is false and event.key is not 'Tab'`, () => {
            const event = {...defaultEvent, key: 'ArrowLeft'};
            component.preventTyping = false;

            component.onKeydown(event);
            expect(counter).toBe(0);
        });
    });


    describe('ngOnChanges', () => {
        let changes: SimpleChanges;

        beforeEach(() => {
            changes = {
                timeList: {
                    currentValue: [],
                    firstChange: true,
                    isFirstChange: () => true,
                    previousValue: undefined,
                }
            };
        });

        it('should set time to 1 and emit it when current time is disabled', waitForAsync(() => {
            component.time = 2;
            component.timeList = [
                {time: 1, angle: 0, disabled: false},
                {time: 2, angle: 0, disabled: true},
                {time: 3, angle: 0, disabled: false},
            ];
            component.timeChanged.subscribe(time => expect(time).toBe(1));
            component.ngOnChanges(changes);

            expect(component.time).toBe(1);
        }));

        it('should not change and emit time when current time is not disabled', fakeAsync(() => {
            let counter = 0;
            component.timeList = [
                {time: 1, angle: 0, disabled: false},
                {time: 2, angle: 0, disabled: false},
                {time: 3, angle: 0, disabled: false},
            ];
            component.time = 2;
            component.timeChanged.subscribe(() => counter++);
            component.ngOnChanges(changes);

            tick();
            expect(component.time).toBe(2);
            expect(counter).toBe(0);
        }));
    });

    describe('onModelChange', () => {

        it('should parse value and set it to time property', () => {
            const unparsedTime = DateTime.fromObject({minute: 10, numberingSystem: 'arab'}).toFormat('m');
            component.time = 5;
            component.timeUnit = NgxMatTimepickerUnits.MINUTE;

            component.onModelChange(unparsedTime);

            expect(component.time).toBe(10);

        });
    });

    describe('onFocus', () => {

        it('should change focus flag to true and set previousTime when focus event fires', () => {
            component.isFocused = false;
            component.onFocus();

            expect(component.isFocused).toBeTruthy();
        });
    });

    describe('onBlur', () => {

        it('should change focus flag to false when blur event fires', () => {
            component.isFocused = true;

            component.onBlur();
            expect(component.isFocused).toBeFalsy();
        });

        it('should emit time when blur event fires and time was changed', waitForAsync(() => {
            const expectedTime = 10;
            component.time = expectedTime;

            component.timeChanged.subscribe(time => expect(time).toBe(expectedTime));

            component.onBlur();
        }));

        it('should not emit time when blur event fires and time was not changed', fakeAsync(() => {
            let counter = 0;
            component.time = 10;

            component.timeChanged.subscribe(() => ++counter);

            component.onFocus();
            component.onBlur();

            tick();

            expect(counter).toBe(0);
        }));
    });
});
