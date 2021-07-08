const Operation = require('./Operation');

function diff(oldStrList, newStrList, timeStamp, siteId) {
    oldStrList = generateIdList(oldStrList);
    newStrList = generateIdList(newStrList);
    timeStamp = JSON.parse(JSON.stringify(timeStamp))
    
    let j = 0,
        op = [];
    let prevStr = oldStrList[j];
    let nextStr = newStrList[j];

    while (prevStr && nextStr && prevStr.id === nextStr.id) {
        j++;
        prevStr = oldStrList[j];
        nextStr = newStrList[j];
    }

    let oldEnd = oldStrList.length - 1;
    let newEnd = newStrList.length - 1;
    prevStr = oldStrList[oldEnd];
    nextStr = newStrList[newEnd];
    while (prevStr && nextStr && prevStr.id === nextStr.id) {
        oldEnd--;
        newEnd--;
        prevStr = oldStrList[oldEnd];
        nextStr = newStrList[newEnd];
    }

    // 有需要新插入的节点，要构造插入操作。
    if (j > oldEnd && j <= newEnd) {
        let insertStr = '';
        let insertPos = oldEnd + 1;
        while (j <= newEnd) {
            insertStr = newStrList[j].char;
            insertPos = j;
            op.push(new Operation({
                type: 'insert',
                string: insertStr,
                p: insertPos,
                timeStamp,
                siteId
            }));
            j++;
        }    
    } else if (j > newEnd) {
        
        while (j <= oldEnd) {
            let deletePos = j;
            op.push(new Operation({
                
                type: 'delete',
                string: oldStrList[j].char,
                p: deletePos,
                timeStamp,
                siteId
            }))
            j++;
        }
    } else {
        //let copyStr = JSON.parse(JSON.stringify(oldStrList));
        const newStrNum = newEnd - j + 1;
        const oldStart = j;
        const newStart = j;
        let map = createStrMap(newStrList, j, newEnd);
        const source = new Array(newStrNum).fill(-1);
        let curMaxIndex = -1;
        let move = false;
        let isUse = 0;
        for (let i = j; i <= oldEnd; i++) {
            if (isUse < newStrNum) {
                let newIndex = map[oldStrList[i].id];
                if (newIndex) {
                    isUse++;
                    source[newIndex - j] = i;
                    if (newIndex < curMaxIndex) {
                        move = true;
                    } else {
                        curMaxIndex = newIndex;
                    }
                } else {
                    
                    
                    let deletePos = getCharPos(oldStrList,oldStrList[i].id)
                    
                    op.push(new Operation({
                        type: 'delete',
                        string: oldStrList[i].char,
                        p: deletePos,
                        timeStamp,
                        siteId
                    }))
                    //deleteStrFunc(copyStr,oldStrList[i].char,deletePos)
                    //copyStr.splice(deletePos,1)
                }

            } else {
                let deletePos = getCharPos(oldStrList,oldStrList[i].id)
                op.push(new Operation({
                    type: 'delete',
                    string: oldStrList[i].char,
                    p: deletePos,
                    timeStamp,
                    siteId
                }))
                //deleteStrFunc(copyStr,oldStrList[i].char,deletePos)
                //copyStr.splice(deletePos,1)
            }
        }

        // 判断是否需要进行move操作
        if (move) {
            const seq = lis(source);
            
            let j = seq.length - 1;
            
            for (let i = newStrNum - 1; i >= 0; i--) {
                if (source[i] === -1) {
                    
                    let insertPos = getCharPos(newStrList,newStrList[i + newStart + 1] ? newStrList[i + newStart + 1].id : null);
                    insertPos = insertPos === -1 ? newStrList.length : insertPos;
                    const insertStr = newStrList[i + newStart].char;
                    
                    op.push(new Operation({
                        type: 'insert',
                        string: insertStr,
                        p: insertPos,
                        timeStamp,
                        siteId
                    }))
                    //insertStrFunc(copyStr,newStrList[i + newStart],insertPos)
                    
                    
                
                } else if (i !== seq[j]) {
                    let newPos = getCharPos(newStrList,newStrList[i + newStart + 1] ? newStrList[i + newStart + 1].id : null);
                    newPos = newPos === -1 ? newStrList.length : newPos;
                    const moveStr = newStrList[i + newStart].char;
                    const oldPos = source[i]//getCharPos(newStrList,newStrList[i + newStart].id);
                    op.push(new Operation({
                        type: 'move',
                        string: moveStr,
                        p: [oldPos, newPos],
                        timeStamp,
                        siteId
                    }))
                    //moveStrFunc(copyStr,newStrList[i + newStart],[oldPos,newPos])
                } else {
                    j--;
                }
            }
        } else {
            for (let i = source.length - 1; i >= 0; i--) {
                if (source[i] === -1) {
                    let insertPos = getCharPos(newStrList,newStrList[i + newStart + 1] ? newStrList[i + newStart + 1].id : null);
                    insertPos = insertPos === -1 ? newStrList.length : insertPos;
                    
                    const insertStr = newStrList[i + newStart].char;
                    
                    
                    op.push(new Operation({
                        type: 'insert',
                        string: insertStr,
                        p: insertPos,
                        timeStamp,
                        siteId
                    }))
                    //insertStrFunc(copyStr,newStrList[i + newStart],insertPos)
                    
                }
            }
        }
    }

    return op
}

function getCharPos(list,target){
    if(!target){
        return -1;

    }
    for(let i = 0;i < list.length;i++){
        if(list[i].id === target){
            return i;
        }
    }
    return -1;
}

function lis(list) {
    let maxIndex = 0;
    let dp = [];
    for (let i = 0; i < list.length; i++) {
        dp[i] = 1;
        for (let j = 0; j < i; j++) {
            if (list[i] > list[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
                maxIndex = dp[i] > dp[maxIndex] ? i : maxIndex
            }
        }
    }

    function generateLIS() {
        let res = [maxIndex];

        for (let i = maxIndex; i >= 0; i--) {
            if ((list[i] < list[maxIndex]) && (dp[i] + 1 === dp[maxIndex])) {
                res.unshift(i)
                maxIndex = i;
            }
        }
        return res;
    }

    return generateLIS();
}

function generateIdList(list){
    let map = {};
    let result = [];
    for(let i = 0;i < list.length;i++){
        let char = list[i];
        if(map[char]){
            map[char] = map[char] + 1;
        }else{
            map[char] = 1;
        }
        result.push({
            char,
            id:`${char}${map[char]}`
        })
    }

    return result;

}

function createStrMap(nodeList, i, j) {
    let map = {}
    for (; i <= j; i++) {
        map[nodeList[i].id] = i;
    }
    return map;
}

function insertStrFunc(str, insertS, pos) {
    str.splice(pos,0,insertS)
}

function deleteStrFunc(str, deleteS, pos) {
    str.splice(pos,1)
}

function moveStrFunc(str, moveS, pos) {
    let from = pos[0];
    let to = pos[1];
    if (from > to) {
        deleteStrFunc(str, moveS, from);
        insertStrFunc(str, moveS, to);
    } else {
        insertStrFunc(str, moveS, to);
        deleteStrFunc(str, moveS, from);
    }
}

module.exports = diff;

