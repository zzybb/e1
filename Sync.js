function Sync(doc){
    return function e(op){
        if(!op){
            return doc;
        }
        doc.control(op);
        return e;
    }
}
module.exports = Sync;