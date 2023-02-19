export class CustomDate{
    date : Date;
    year : string;
    month : string;
    day : string;

    constructor(date: string|null){
        if(date == null){
            this.date = new Date();
        }else{
            this.date = new Date(date);
        }
        this.year = this.date.getFullYear().toString();
        this.month = (this.date.getMonth() + 1 < 10) ? "0" + (this.date.getMonth() + 1).toString() : (this.date.getMonth() + 1).toString();
        this.day = (this.date.getDate()< 10) ? "0" + (this.date.getDate()).toString() : (this.date.getDate()).toString();
    }
    GetDate = () => {
        return this.year + '-' + this.month + '-' + this.day;
    }
    GetDateToShow = () => {
        return this.date.toDateString();
    }
    GetMonthYear = () => {
        return this.year + '-' + this.month;
    }
    GetMonthYearToShow = () => {
        let month = this.date.toLocaleString('default', {month : 'long'});
        return month + ' ' + this.year;
    }
    GetYear = () => {
        return this.year;
    }
}