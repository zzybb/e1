
module.exports =  class Operation {
    constructor({type,string,p,timeStamp,siteId}){
        
        this.type = type;
        this.char = string;
        this.p = p;
        this.timeStamp = timeStamp;
        this.siteId = siteId;
    }
}