export enum DatePrecision {
    Day = "Day",
    Month = "Month",
    Year = "Year",
}
export class CustomDate{
    date : Date;
    year : string;
    month : string;
    day : string;
    precision : DatePrecision;

    constructor(date: string|null,precision : DatePrecision){
        if(date == null){
            this.date = new Date();
        }else{
            this.date = new Date(date);
        }
        this.precision = precision;
        this.year = this.date.getFullYear().toString();
        this.month = (this.date.getMonth() + 1 < 10) ? "0" + (this.date.getMonth() + 1).toString() : (this.date.getMonth() + 1).toString();
        this.day = (this.date.getDate()< 10) ? "0" + (this.date.getDate()).toString() : (this.date.getDate()).toString();
    }
    GetDate = () => {
        return this.year + '-' + this.month + '-' + this.day;
    }
    // delete
    GetDateToShow = () => {
        return this.date.toDateString();
    }
    GetMonthYear = () => {
        return this.year + '-' + this.month;
    }
    // delete
    GetMonthYearToShow = () => {
        let month = this.date.toLocaleString('default', {month : 'long'});
        return month + ' ' + this.year;
    }
    GetYear = () => {
        return this.year;
    }
    GetPrecision = () => {
        return this.precision;
    }
    ToString = () => {
        switch(this.precision){
            case DatePrecision.Day:
                return this.date.toDateString();
            case DatePrecision.Month:
                let month = this.date.toLocaleString('default', {month : 'long'});
                return month + ' ' + this.year;
            case DatePrecision.Year:
                return this.year;
        }
    }
}