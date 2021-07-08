// 该文件测试了操作数优化
const diff = require('../createOp2')
const fs = require('fs')
const opObj = require('../data/numTo/str_4000.json')
let charList = 'abcdefghijklmnopqrstqzwxyz123456789_!@#$%^&*()-=~`+<>?'.split("");
let opType = ['insert', 'delete']

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

function randomStr(charList, charLength) {  
    let length = charLength;
    if (!length) {
        length = Math.ceil(Math.random() * 100)
    }

    let r = '';
    for (let i = 0; i < length; i++) {
        let selectIndex = Math.ceil(Math.random() * (charList.length - 1));
        r += charList[selectIndex]
    }
    return r;
}

/**
 * 获得一个合法的索引
 */
function randomIndex(length) {
    if (!length) {
        return length;

    }
    return randomNum(0, length);

}


function createOp(opNum) {
    let opList = [];
    let oldStr = curStr = randomStr(charList,4000)
    let op = null;
    let t = 0;
    for (let i = 0; i < opNum; i++) {
        let curIndex = randomIndex(curStr.length);
        if (curIndex === curStr.length) {
            let char = randomStr(charList, 1)
            op = {
                type: 'insert',
                char,
                p: curIndex,
                siteId: 0,
                timeStamp: [++t, 0]
            }
            curStr += char;
        } else {
            let curType = opType[randomIndex(1)];
            let char = randomStr(charList, 1);
            if (curType === 'insert') {
                op = {
                    type: 'insert',
                    char,
                    p: curIndex,
                    siteId: 0,
                    timeStamp: [++t, 0]
                }
                curStr = curStr.slice(0, curIndex) + char + curStr.slice(curIndex);
            } else {
                op = {
                    type: 'delete',
                    char: curStr[curIndex],
                    p: curIndex,
                    siteId: 0,
                    timeStamp: [++t, 0]
                }
                curStr = curStr.slice(0, curIndex) + curStr.slice(curIndex + 1);
            }
        }


        opList.push(op);

    }
    let o = {
        oldStr,
        newStr:curStr,
        opList,
        
    }
    let str = JSON.stringify(o, null, "\t")
    fs.writeFile('../data/numTo/str_4000.json', str, function (err) {
        if (err) {
            console.log(err)
        }
    })
    return opList

}

function cStr(opList,oldStr) {
    let curStr = oldStr;
    opList.forEach(op => {
        if (op.type === 'delete') {
            curStr = curStr.slice(0, op.p) + curStr.slice(op.p + 1);
        } else {
            curStr = curStr.slice(0, op.p) + op.char + curStr.slice(op.p);
        }


    });
    return curStr;
}

function computeASTS(opList) {
    let result = 0;
    let i = 0;
    let nextIndex;
    while (i < opList.length) {
        if (opList[i].type === 'insert') {
            nextIndex = computeInsert(opList, i, opList[i]);
        } else {
            nextIndex = computeDelete(opList, i, opList[i]);
        }
        result += 1;
        i = nextIndex;
    }
    return result;

}

function computeInsert(opList, curIndex, op) {
    let p = op.p;
    curIndex++;
    while (curIndex !== opList.length) {

        if (opList[curIndex].p === ++p) {
            curIndex++;
        } else {
            break;
        }
    }
    return curIndex;

}

function computeDelete(opList, curIndex, op) {
    let p = op.p;
    curIndex++;
    while (curIndex !== opList.length) {

        if (opList[curIndex].p === p) {
            curIndex++;
        } else {
            break;
        }
    }
    return curIndex;
}

function computeNoMove(opList){
    let result = 0;
    

    opList.forEach( op => {
        if(op.type === 'move'){
            result += 2;
        }else{
            result += 1;
        }
    })
    return result;

}
//createOp(1000)
 let str = cStr(opObj.opList,opObj.oldStr)
 console.log(str === opObj.newStr)
 let diffOp = diff(opObj.oldStr, opObj.newStr, [1, 0], 0);


// console.log(str)
console.log(`diff : ${diffOp.length}`)
console.log(`nomove: ${computeNoMove(diffOp)}`)
console.log(`ASTS: ${computeASTS(opObj.opList)}`)
// ['product', 'AST', 'ASTS', 'diff-AST-noMove'],
//             ['1', 100,83, 18],
//             ['2', 200,188, 28],
//             ['3', 300,278, 32],
//             ['4', 400,385, 60],
//             ['5', 500,470, 42],
//             ['6', 600,562, 40],
//             ['7', 700,674, 48],
//             ['8', 800,767, 28],
//             ['9', 900,849, 46],
//             ['10', 1000,946, 70],