export class TodayDate{
    year : string;
    month : string;
    day : string;
    
    constructor(){
        let date = new Date();
        this.year = date.getFullYear().toString();
        this.month = (date.getMonth() + 1 < 10) ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        this.day = (date.getDate()< 10) ? "0" + (date.getDate()).toString() : (date.getDate()).toString();
    }

    GetDate = () => {
        return this.year + '-' + this.month + '-' + this.day;
    }
    GetMonthYear = () => {
        return this.year + '-' + this.month;
    }
    GetYear = () => {
        return this.year;
    }
}