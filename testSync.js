const Doc = require("./Doc2");
const diff = require("./createOp2")
let charList = 'abcdefghijklmnopqrstqzwxyz123456789_!@#$%^&*()-=~`+<>?'.split("");
let site1 = {
    doc: new Doc('', 3, 0)
}
let site2 = {
    doc: new Doc('', 3, 1)
}
let site3 = {
    doc: new Doc('', 3, 2)
}

let site = [site1, site2, site3]

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

function selectSite() {
    let result = [];
    let num = 1 + Math.round(Math.random() * 2);
    let set = new Set();
    while (result.length !== num) {
        let s = Math.round(Math.random() * 2);
        if (set.has(s)) {
            continue;
        }
        set.add(s)
        result.push(site[s]);
    }
    return result;
}

function test(times) {

    for (let i = 0; i < times; i++) {
        let sites = selectSite();
        for (let i = 0; i < sites.length; i++) {
            let result = [];
            let currentDoc = sites[i].doc;
            let time = JSON.parse(JSON.stringify(currentDoc.timeStamp));
            time[currentDoc.id]++;
            let opList = diff(currentDoc.DocData, randomStr(charList, 100), time, currentDoc.id);
            for (let j = 0; j < site.length; j++) {
                site[j].doc.control(opList);
                result.push(site[j].doc.DocData);

            }

            if (isEqual(result)) {

                console.log(`success!  本次操作站点数：${sites.length}  
                结果：${result} 
                长度: ${result.length}`)


            } else {
                console.log('error')
            }
        }
    }
}


function isEqual(list) {
    let old = list[0];
    for (let i = 1; i < list.length; i++) {
        if (old === list[i]) {
            old = list[i]
        } else {
            return false;
        }
    }
    return true;

}

test(100);