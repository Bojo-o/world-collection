import { DatePrecision } from "../Enums/DatePrecision";


/**
 * Data model representing date with precision.
 * Precision represent date format.
 * For example date is represented only as mounth and year when precison is setted as Month.
 * In this project it is used in showing collectible date of visit.
 */
export class DateWithPrecision {
    private date: Date;
    private year: string;
    private month: string;
    private day: string;
    private precision: DatePrecision;

    constructor(date: string | null, precision: DatePrecision) {
        if (date == null) {
            this.date = new Date();
        } else {
            this.date = new Date(date);
        }
        this.precision = precision;
        this.year = this.date.getFullYear().toString();
        this.month = (this.date.getMonth() + 1 < 10) ? "0" + (this.date.getMonth() + 1).toString() : (this.date.getMonth() + 1).toString();
        this.day = (this.date.getDate() < 10) ? "0" + (this.date.getDate()).toString() : (this.date.getDate()).toString();
    }
    getDate = () => {
        return this.year + '-' + this.month + '-' + this.day;
    }

    getMonthYear = () => {
        return this.year + '-' + this.month;
    }

    getYear = () => {
        return this.year;
    }

    getPrecision = () => {
        return this.precision;
    }
    /**
     * Date converted to string.
     * @returns Date as string with applied precision.
     */
    ToString = () => {
        switch (this.precision) {
            case DatePrecision.Day:
                return this.date.toDateString();
            case DatePrecision.Month:
                let month = this.date.toLocaleString('default', { month: 'long' });
                return month + ' ' + this.year;
            case DatePrecision.Year:
                return this.year;
        }
    }
}