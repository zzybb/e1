const type = require('./type')
function _initTimeStamp(siteNum) {
    let arr = new Array(siteNum);
    arr.fill(0);
    return arr;
}

/** 
 * 函数用于判断old_sv是否小于new_sv
 * 如果等于返回0,小于等于返回1，大于返回-1
 * @param {*} old_sv 
 * @param {*} new_sv 
 * @returns 
 */
function _SVisLessThan(old_sv, new_sv) {
    let hasLess = false;
    for (let i = 0; i < old_sv.length; i++) {
        const [new_sv_data, old_sv_data] = [new_sv[i], old_sv[i]];
        if (new_sv_data === old_sv_data) {
            continue;
        } else if (old_sv_data > new_sv_data) {
            return type.MORE;
        } else {
            hasLess = true;
        }
    }

    return hasLess ? type.LESS : type.EQUAL;
}

function sum(arr) {
    return arr.reduce((a, b) => a + b);
}

/**
 * 如果是先序关系,返回1
 * 如果是并发关系,返回0
 * 如果是因果后续，返回-1
 * @param {*} old_sv 
 * @param {*} new_sv 
 */
function _judgeRelation(old_sv, new_sv) {
    const s1 = _SVisLessThan(old_sv, new_sv);
    const s2 = _SVisLessThan(new_sv, old_sv);
    if (s1 === type.LESS) {
        return type.PRE_CAUSAL;
    } else if (s1 === type.MORE && s2 === type.MORE) {
        return type.CONCURRENT;
    } else if (s2 === type.LESS) {
        return type.AFT_CAUSAL
    }
}

function _TOrderCompare(old_sv,old_id, new_sv,new_id) {
    const sum_old = sum(old_sv);
    const sum_new = sum(new_sv);
    if (sum_old < sum_new) {
        return type.LESS;
    } else if((sum_old === sum_new) && (old_id < new_id)){
        return type.LESS;
    }else {
        return type.MORE;
    }

}

module.exports = {
    _initTimeStamp,
    _SVisLessThan,
    _judgeRelation,
    _TOrderCompare

}

