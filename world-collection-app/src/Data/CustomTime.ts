export enum Precision{
    Day,
    Month,
    Year
}
export class CustomTime{
    private isBC  : boolean = false;
    private precision : Precision = Precision.Day;

    private day : number;
    private month : number;
    private year : number;

    constructor(precision : Precision,isBC : boolean,year : number,month : number = 1,day : number = 1){
        if (year < 0 || month > 12 || month < 1 || day < 1 || day > 31){
            throw new Error('Invalid arguments');
        }
        this.day  = day;
        this.month = month;
        this.year = year;
        this.precision = precision;
        this.isBC = isBC;
    }
    

    public getYear(){
        return this.year;
    }
    public getString(){
        let day = "00";
        let month = "00";
        let year = (this.isBC) ? "-" + this.year.toString() : this.year.toString();

        if (this.precision == Precision.Month || this.precision == Precision.Day){
            month = (this.month < 10) ? "0" + this.month.toString() : this.month.toString();
        }
        if (this.precision == Precision.Day){
            day = (this.day < 10) ? "0" + this.day.toString() : this.day.toString();
        }
        switch(this.precision) {
            case Precision.Day:
                break;
            case Precision.Month:
                break;
            case Precision.Year:
                return year + "-";
                
        }
        return year + "-" + month + "-" + day;
    }

}