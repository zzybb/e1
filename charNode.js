module.exports =  class charNode {
    constructor(data,insertOp){
        this.charData = data;
        this.effective = true;
        this.insertOp = insertOp;
        this.deleteOpList = [];
    }
}