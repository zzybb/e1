
const {
    _initTimeStamp,
    _SVisLessThan,
    _judgeRelation,
    _TOrderCompare,
} = require('./util')

const charNode = require('./charNode')
const type = require('./type')


class Doc {
    constructor(initData = '', siteNum,id) {
        if (!siteNum) {
            throw Error("please input site number");
        }
        this.id = id;
        this.DocData = initData;
        this.NodeList = [];
        this.timeStamp = _initTimeStamp(siteNum);
    }

    computeData(){
        let result = '';
        this.NodeList.forEach(node => {
            if(node.effective){
                result += node.charData;
            }
        })
        this.DocData = result;
    }

    control(op) {
        this.retracing(op.timeStamp);
        this.executeOp(op);
        this.changeDocTimeStamp(op.siteId);
        this.retracing(this.timeStamp);
        this.computeData();
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

    executeOp(op) {
        if (op.type === type.INSERT) {
            this.executeInsert(op);

        } else if (op.type === type.DELETE) {
            this.executeDelete(op);
        }
    }

    executeInsert(op) {
        const {
            leftIndex,
            rightIndex
        } = this.findRange(op.p);
        const insertPos = this.range_scan(leftIndex, rightIndex,op);
        let newNode = new charNode(op.char,op);
        // ???????????????????????????
        this.NodeList.splice(insertPos, 0, newNode);

    }

    range_scan(leftIndex, rightIndex, op) {
        let [result, scanIndex, NodeList] = [null, leftIndex, this.NodeList];
        while (scanIndex < rightIndex) {
            const scanNodeOp = NodeList[scanIndex].insertOp;
            const newNodeOp = op;
            const orderType = _judgeRelation(scanNodeOp.timeStamp, newNodeOp.timeStamp);
            if (orderType === type.CONCURRENT) {
                const TOrderCompareResult = _TOrderCompare(newNodeOp.timeStamp,newNodeOp.siteId,scanNodeOp.timeStamp,scanNodeOp.siteId);
                if ((TOrderCompareResult === type.LESS) && !result) {
                    result = scanIndex;
                    break;
                }
                if (TOrderCompareResult === type.MORE) {
                    result = null;
                }
            }
            if(orderType === type.PRE_CAUSAL){
                if(!result){
                    result = scanIndex;
                }
                break;
            }
            scanIndex++;
        }

        return result !== null ? result : rightIndex;
    }

    /**
     * 1. ??????????????????????????????leftIndex = rightIndex = 0;
     * 2. ???????????????????????????????????????????????????leftIndex = rightIndex = pos;
     * 3. ?????????????????????????????????????????????,??????leftIndex = ????????????????????????,rightIndex = ????????????????????????????????????;
     * ?????????leftIndex??????????????????????????????????????????pos?????????????????????rightIndex???????????????
     * @param {*} pos 
     * @returns 
     */

    findRange(pos) {
        let [ leftIndex, rightIndex, NodeList, eum] = [pos, 0, this.NodeList, 0];
        while( (rightIndex < NodeList.length) && eum <= pos ){
            if(NodeList[rightIndex].effective){
                eum++;
                if(eum > pos){
                    break;
                }
            }
            rightIndex++;
        }
        return {
            leftIndex,
            rightIndex
        }
    }

    executeDelete(op) {
        let [NodeList, pos, eNum,index] = [this.NodeList, op.p, 0,0];
        while((index < NodeList.length) && eNum < pos){
            if(NodeList[index].effective){
                eNum++;
            }
            index++;
        }

        NodeList[index].deleteOpList.push(op);
        NodeList[index].effective = false;
    }

    changeDocTimeStamp(siteId) {
        this.timeStamp[siteId]++;
    }
}


module.exports = Doc;
