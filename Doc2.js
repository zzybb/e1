const {
    _initTimeStamp,
    _SVisLessThan,
    _judgeRelation,
    _TOrderCompare,
} = require('./util')

const charNode = require('./charNode')
const type = require('./type');
const Operation = require('./Operation');


class Doc {
    constructor(initData = '', siteNum, id) {
        if (!siteNum) {
            throw Error("please input site number");
        }
        this.id = id;
        this.DocData = initData;
        this.NodeList = [];
        this.AfterOrderList = [];
        this.timeStamp = _initTimeStamp(siteNum);
    }

    computeData() {
        let result = '';
        this.NodeList.forEach(node => {
            if (node.effective) {
                result += node.charData;
            }
        })
        this.DocData = result;
    }

    canExecute(newTimeStamp,currentTimeStamp,id){
        
        if(currentTimeStamp[id] + 1 !== newTimeStamp[id]){
            return false;
        }
        return true;

    }

    control(opList) {
        if(!opList || !opList.length){
            return;

        }
        if(!this.canExecute(opList[0].timeStamp,this.timeStamp,opList[0].siteId)){
            
            this.AfterOrderList.push(opList);
            return;
        }
        this.retracing(opList[0].timeStamp);
        this.executeOp(opList);
        this.changeDocTimeStamp(opList[0].siteId);
        this.retracing(this.timeStamp);
        this.afterOrderExecute();
        this.computeData();
    }

    afterOrderExecute() {
        let l = this.AfterOrderList.length;
        for (let i = 0; i < l; i++) {
            let opList = this.AfterOrderList[i];
            if(opList && this.canExecute(opList[0].timeStamp,this.timeStamp,opList[0].siteId)){
                this.AfterOrderList.splice(i,1);
                this.control(opList);
            }
        }
    }

    retracing(new_op_timeStamp) {
        let insertOpTimeStamp, deleteOpList, deleteOpTimeStamp, v;
        this.NodeList.forEach(currentNode => {
            insertOpTimeStamp = currentNode.insertOp.timeStamp;
            currentNode.effective = false;
            v = _SVisLessThan(insertOpTimeStamp, new_op_timeStamp);
            if (v === type.LESS || v === type.EQUAL) {
                currentNode.effective = true;
            }

            deleteOpList = currentNode.deleteOpList;
            deleteOpList.forEach(op => {
                deleteOpTimeStamp = op.timeStamp;
                v = _SVisLessThan(deleteOpTimeStamp, new_op_timeStamp);
                if (v === type.LESS || v === type.EQUAL) {
                    currentNode.effective = false;
                }
            })
        })
    }

    ASTExecute(op) {
        let count = 0;
        let i = 0;
        for (i = 0; i < this.NodeList.length; i++) {
            let node = this.NodeList[i];
            if (node.effective) {
                count++;
            }
            if (count === op.p) {
                return this.range_scan(this.NodeList, i, op);
            }
        }
        return i;
    }

    range_scan(NodeList, scanIndex, op) {
        if (NodeList[scanIndex] && NodeList[scanIndex].effective) {
            scanIndex += 1
        }

        let result = null;
        while (NodeList[scanIndex] && !NodeList[scanIndex].effective) {
            const scanNodeOp = NodeList[scanIndex].insertOp;
            const newNodeOp = op;
            const orderType = _judgeRelation(scanNodeOp.timeStamp, newNodeOp.timeStamp);
            if (orderType === type.CONCURRENT) {
                const TOrderCompareResult = _TOrderCompare(newNodeOp.timeStamp, newNodeOp.siteId, scanNodeOp.timeStamp, scanNodeOp.siteId);
                if ((TOrderCompareResult === type.LESS) && result === null) {
                    result = scanIndex;

                }
                if (TOrderCompareResult === type.MORE && result !== null && _judgeRelation(scanNodeOp.timeStamp, NodeList[result].insertOp.timeStamp) === type.PRE_CAUSAL) {
                    
                    result = null;
                }
            }
            if (orderType === type.PRE_CAUSAL) {
                if(result === null){
                    result = scanIndex;

                }
                
                break;
            }
            scanIndex++;
        }
        return result === null ? scanIndex : result;

    }

    executeOp(opList) {

        opList.forEach(op => {
            if (op.type === type.INSERT) {
                this.executeInsert(op);
            } else if (op.type === type.DELETE) {
                this.executeDelete(op);
            } else if (op.type === type.MOVE) {
                this.executeMove(op);
            }
        })

    }

    executeMove(op) {
        let opInsert = new Operation({
            type: 'insert',
            string: op.char,
            p: op.p[1],
            timeStamp: op.timeStamp,
            siteId: op.siteId
        })
        let opDelete = new Operation({
            type: 'delete',
            string: op.char,
            p: op.p[0],
            timeStamp: op.timeStamp,
            siteId: op.siteId
        })
        this.executeDelete(opDelete);
        this.executeInsert(opInsert);
    }

    executeInsert(op) {
        const insertPos = this.ASTExecute(op);
        let newNode = new charNode(op.char, op);
        // 向指定位置插入元素
        this.NodeList.splice(insertPos, 0, newNode);

    }

    executeDelete(op) {
        let [NodeList, pos, eNum, index] = [this.NodeList, op.p, 0, 0];
        while ((index < NodeList.length)) {
            if (NodeList[index].effective) {
                eNum++;
            }
            if (eNum === pos + 1) {
                break;

            }
            index++;
        }

        if (index < NodeList.length) {
            NodeList[index].deleteOpList.push(op);
            NodeList[index].effective = false;
        }
    }

    changeDocTimeStamp(siteId) {
        this.timeStamp[siteId]++;
    }
}


module.exports = Doc;