import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    TemplateRef
} from "@angular/core";
import {ThemePalette} from "@angular/material/core";
//
import {NgxMatTimepickerPeriods} from "../../models/ngx-mat-timepicker-periods.enum";
import {NgxMatTimepickerUnits} from "../../models/ngx-mat-timepicker-units.enum";
import {NgxMatTimepickerClockFace} from "../../models/ngx-mat-timepicker-clock-face.interface";
import {NgxMatTimepickerLocaleService} from "../../services/ngx-mat-timepicker-locale.service";
import {NgxMatTimepickerUtils} from "../../utils/ngx-mat-timepicker.utils";
//
import {DateTime, Info} from "ts-luxon";

@Component({
    selector: "ngx-mat-timepicker-dial",
    templateUrl: "ngx-mat-timepicker-dial.component.html",
    styleUrls: ["ngx-mat-timepicker-dial.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxMatTimepickerDialComponent implements OnChanges {

    @Input() activeTimeUnit: NgxMatTimepickerUnits;

    @Input()
    set color(newValue: ThemePalette) {
        this._color = newValue;
    }

    get color(): ThemePalette {
        return this._color;
    }

    private get _locale(): string {
        return this._localeSrv.locale;
    }

    @Input() editableHintTmpl: TemplateRef<Node>;
    @Input() format: number;
    @Input() hour: number | string;
    @Output() hourChanged = new EventEmitter<NgxMatTimepickerClockFace>();

    hours: NgxMatTimepickerClockFace[];
    @Input() hoursOnly: boolean;
    @Input() isEditable: boolean;

    isHintVisible: boolean;
    @Input() maxTime: DateTime;
    meridiems = Info.meridiems({locale: this._locale});
    @Input() minTime: DateTime;
    @Input() minute: number | string;
    @Output() minuteChanged = new EventEmitter<NgxMatTimepickerClockFace>();
    minutes: NgxMatTimepickerClockFace[];
    @Input() minutesGap: number;
    @Input() period: NgxMatTimepickerPeriods;

    @Output() periodChanged = new EventEmitter<NgxMatTimepickerPeriods>();

    timeUnit = NgxMatTimepickerUnits;
    @Output() timeUnitChanged = new EventEmitter<NgxMatTimepickerUnits>();

    private _color: ThemePalette = "primary";

    constructor(private _localeSrv: NgxMatTimepickerLocaleService) {
    }

    changeHour(hour: NgxMatTimepickerClockFace): void {
        this.hourChanged.next(hour);
    }

    changeMinute(minute: NgxMatTimepickerClockFace): void {
        this.minuteChanged.next(minute);
    }

    changePeriod(period: NgxMatTimepickerPeriods): void {
        this.periodChanged.next(period);
    }

    changeTimeUnit(unit: NgxMatTimepickerUnits): void {
        this.timeUnitChanged.next(unit);
    }

    hideHint(): void {
        this.isHintVisible = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        const periodChanged = changes.period && changes.period.currentValue;
        if (periodChanged || changes.format && changes.format.currentValue) {
            const hours = NgxMatTimepickerUtils.getHours(this.format);

            this.hours = NgxMatTimepickerUtils.disableHours(hours, {
                min: this.minTime,
                max: this.maxTime,
                format: this.format,
                period: this.period
            });
        }
        if (periodChanged || changes.hour && changes.hour.currentValue) {
            const minutes = NgxMatTimepickerUtils.getMinutes(this.minutesGap);

            this.minutes = NgxMatTimepickerUtils.disableMinutes(minutes, +this.hour, {
                min: this.minTime,
                max: this.maxTime,
                format: this.format,
                period: this.period
            });
        }
    }

    showHint(): void {
        this.isHintVisible = true;
    }
}
