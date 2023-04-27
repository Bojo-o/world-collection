import { DatePrecision } from "../Enums/DatePrecision";

/**
 * Data model representing point of time with precision.
 * Precision represent date format.
 * For example date is represented only as mounth and year when precison is setted as Month.
 * In this project it is used in filtering time.
 */
export class TimeWithPrecision {
    /**Flag, which indicates if time is before Christ */
    private isBC: boolean = false;
    private precision: DatePrecision = DatePrecision.Day;

    private day: number;
    private month: number;
    private year: number;

    constructor(precision: DatePrecision, isBC: boolean, year: number, month: number = 1, day: number = 1) {
        if (year < 0 || month > 12 || month < 1 || day < 1 || day > 31) {
            throw new Error('Invalid arguments');
        }
        this.day = day;
        this.month = month;
        this.year = year;
        this.precision = precision;
        this.isBC = isBC;
    }

    public getYear() {
        return this.year;
    }
    public getString() {
        let day = "00";
        let month = "00";
        let year = (this.isBC) ? "-" + this.year.toString() : this.year.toString();

        if (this.precision == DatePrecision.Month || this.precision == DatePrecision.Day) {
            month = (this.month < 10) ? "0" + this.month.toString() : this.month.toString();
        }
        if (this.precision == DatePrecision.Day) {
            day = (this.day < 10) ? "0" + this.day.toString() : this.day.toString();
        }

        return year + "-" + month + "-" + day;
    }

}