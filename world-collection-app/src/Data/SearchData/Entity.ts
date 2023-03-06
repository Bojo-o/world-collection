export class Entity{
    private QNumber : string;
    private name : string;
    constructor (QNumber : string,name : string){
        this.QNumber = QNumber;
        this.name = name;
    }
    public GetQNumber(){
        return this.QNumber;
    }
    public GetName(){
        return this.name;
    }
}