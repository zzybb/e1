const diff = require('./createOp2')
const Doc = require('./Doc2');
const opObj = require('./data/numTo/str_4000.json')
let charList = 'abcdefghijklmnopqrstqzwxyz123456789_!@#$%^&*()-=~`+<>?'.split("");

function randomStr(charList,charLength) {
    let length = charLength;
    if(!length){
        length = Math.ceil(Math.random() * 100)
    }

    let r = '';
    for (let i = 0; i < length; i++) {
        let selectIndex = Math.ceil(Math.random() * (charList.length - 1));
        r += charList[selectIndex]
    }
    return r;
}

function test(time) {
    let opList = diff(opObj.oldStr,opObj.newStr,[1,0],0)
    // let oldStr = '';
    // let newStr = randomStr(charList);
    // let doc = new Doc('',2,0);
    // let currentTimeStamp = [1,0];
    // let id = 0;
    
    
    // let opList = diff(opObj.oldStr,opObj.newStr,currentTimeStamp,id)
    // doc.control(opList);
    // if(doc.DocData === opObj.newStr){
    //     console.log(`成功!`)
    //     oldStr = newStr;
    //     newStr = randomStr(charList);
    //     currentTimeStamp[id]++;
    // }else{
    //     console.log(`失败. 正确字符串： ${newStr}, 输出字符串：${doc.DocData}`)
        
    // }
    let str = opObj.oldStr;
    opList.forEach(op => {
        if(op.type === 'insert'){
            str = insertStr(str,op.char,op.p);
        }else if(op.type === 'delete'){
            str = deleteStr(str,op.char,op.p);
        }else{
            str = deleteStr(str,op.char,op.p[0]);
            str = insertStr(str,op.char,op.p[1]);
        }

    })
    return str === opObj.newStr;
    
}

console.log(test())
function insertStr(str, insertS, pos) {
    return str.slice(0, pos) + insertS + str.slice(pos);
}

function deleteStr(str, deleteS, pos) {
    return str.slice(0, pos) + str.slice(pos + 1);
}
