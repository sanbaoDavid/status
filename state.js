function _state() {
    const _eventMap = {}
    var curState = ''
    const _numEnum = {
        GREATER: '>',
        GREATEREQUAL: '>=',
        LESS: '<',
        LESSEQUAL: '<=',
        EQUAL: '=='
    };
    const _state = {
        /**
        @param laststate 前状态
        @param nextstate 后状态
        @param condition 对应的标准值
        @param conditionName 绑定变量名称，可以没有，默认创建val属性
        @param conditionObject 变量所在的对象，可以没有默认空对象0
        @param outfuncallback 退出状态时的回调
        @param enterfuncallback 进入状态时的回调
        @param compareEnum 进入状态时的回调
        */
        laststate: '',
        nextstate: '',
        condition: null,
        conditionName: null,
        conditionObject: null,
        outfuncallback: null,
        enterfuncallback: null,
        compareEnum: _numEnum.EQUAL
    }

    function update(value) {
        let condition = _eventMap[curState].condition
        console.log('in value update', curState)
        if (typeof (value) !== 'number') {
            if (value === condition) {
                next();
            }
        }
        else {
            switch (_eventMap[curState].compareEnum) {
                case _numEnum.GREATER:
                    if (value > condition) {
                        next();
                    }
                    break;
                case _numEnum.GREATEREQUAL:
                    if (value >= condition) {
                        next();
                    }
                    break;
                case _numEnum.EQUAL:
                    if (value == condition) {
                        next();
                    }
                    break;
                case _numEnum.LESS:
                    if (value < condition) {
                        next();
                    }
                    break;
                case _numEnum.LESSEQUAL:
                    if (value <= condition) {
                        next();
                    }
                    break;
            }
        }
    }

    function next(name = undefined) {
        _eventMap[curState].outfuncallback()
        let next = ''
        name === undefined ? next = _eventMap[curState].nextstate : next = name
        if (next !== '' && next !== null) {
            _eventMap[next].enterfuncallback()
            curState = next
            return
        }
        curState = false
    }

    //对外方法
    function newState(name, event) {
        if (_eventMap.hasOwnProperty(name)) {
            console.error('状态机内已经包含此状态：' + name)
            return
        }
        if (event.condition === undefined) {
            console.error(name + '状态没有条件')
            return
        }
        let protoFlag = false
        if (!event.conditionObject.hasOwnProperty(event.conditionName)) {
            let proto = Object.getPrototypeOf(event.conditionObject)
            if (!proto.hasOwnProperty(event.conditionName)) {
                console.error('对象内没有属性：' + event.conditionName)
                return
            }
            protoFlag = true
        }
        let valType = typeof (event.conditionObject[event.conditionName])
        if (valType !== 'number' && valType !== 'string' && valType !== 'boolean') {
            console.error('条件变量类型只能是基础类型', name)
            return
        }
        if (typeof (event.condition) !== valType) {
            console.error('条件变量类型和变量类型不匹配', name)
            return
        }
        if (typeof (event.condition) === 'number') {
            if (!event.compareEnum) {
                console.error('数字为条件的状态应指定比较类型', name)
                return
            }
            if (!Object.values(_numEnum).includes(event.compareEnum)) {
                console.error('compareEnum值不对', name)
                return
            }
        }

        if (curState === '') {
            curState = name
        }
        let state = Object.create(_state)
        //两种判断（被监听变量在没在原型里、有没有getset）
        let oProp = undefined
        let handle = {}
        //下面的if else代表了拿到存getset对象的引用
        if (protoFlag) {
            oProp = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(event.conditionObject), event.conditionName)
        }
        else {
            oProp = Object.getOwnPropertyDescriptor(event.conditionObject, event.conditionName)
        }
        //下面两个if else代表了有无getset的监听函数
        let bValue = event.conditionObject[event.conditionName]
        if (oProp.hasOwnProperty('get')) {
            handle.get = function () {
                return oProp.get.call(event.conditionObject)
            }
        }
        else {
            handle.get = function () {
                return bValue;
            }
        }
        if (oProp.hasOwnProperty('set')) {
            handle.set = (value) => {
                if (name === curState) {
                    update(value)
                }
                oProp.set.call(event.conditionObject, value)
            }
        }
        else {
            handle.set = function (newValue) {
                if (name === curState) {
                    update(newValue)
                }
                bValue = newValue;
            }
        }

        Object.defineProperty(event.conditionObject, event.conditionName, handle);

        state.conditionRef = event.conditionRef
        state.condition = event.condition
        state.compareEnum = event.compareEnum
        if (event.enfuncall !== undefined) {
            state.enterfuncallback = event.enfuncall
        }
        if (event.outfuncall !== undefined) {
            state.outfuncallback = event.outfuncall
        }
        _eventMap[name] = state
        let end = getEndState()
        if (end !== name) {
            _eventMap[name].laststate = end
            _eventMap[end].nextstate = name
        }
    }
    function setState(name, callback) {
        if (!_eventMap.hasOwnProperty(name)) {
            console.error('状态机内没有此状态：' + name)
            return
        }
        if (callback) {
            next(name);
            return
        }
        curState = name
    }
    function __insert(name, insert) {
        if (!_eventMap.hasOwnProperty(name)) {
            console.error('状态机内不包此状态：' + name)
            return
        }
        if (!_eventMap.hasOwnProperty(insert)) {
            console.error('状态机内不包此状态：' + insert)
            return
        }
        let last1 = _eventMap[name].laststate
        let next1 = _eventMap[name].nextstate
        let last2 = _eventMap[insert].laststate

        if (last1 !== '') {
            _eventMap[last1].nextstate = next1
        }
        if (next1 !== '') {
            _eventMap[next1].laststate = last1
        }
        if (last2 !== '') {
            _eventMap[last2].nextstate = name
        }
        _eventMap[name].laststate = last2
        _eventMap[name].nextstate = insert
        _eventMap[insert].laststate = name
    }
    function splice(name) {
        if (!_eventMap.hasOwnProperty(name)) {
            console.error('状态机内不包此状态：' + name)
            return
        }
        let next = _eventMap[name].nextstate
        let last = _eventMap[name].laststate
        if (last !== '') {
            _eventMap[last].nextstate = next
        }
        if (next !== '') {
            _eventMap[next].nextstate = last
        }
        delete _eventMap[name]
    }
    function getState() {
        return curState
    }
    function getStartState() {
        let list = Object.keys(_eventMap)
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (_eventMap[element].laststate === '') {
                return element
            }
        }
    }
    function getEndState() {
        let list = Object.keys(_eventMap)
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (_eventMap[element].nextstate === '') {
                return element
            }
        }
    }
    function logStateMap() {
        let cursta = getStartState()
        let map = cursta
        let list = Object.keys(_eventMap)
        for (let index = 0; index < list.length - 1; index++) {
            map += ' --> ' + _eventMap[cursta].nextstate
            cursta = _eventMap[cursta].nextstate
        }
        console.log(list, map)
    }

    const obj = {
        newState(name, event) {
            return newState(name, event)
        },
        insert(name, insert) {
            __insert(name, insert)
        },
        splice(name) {
            splice(name)
        },
        getState() {
            getState()
        },
        getStartState() {
            getStartState()
        },
        getEndState() {
            getEndState()
        },
        logStateMap() {
            logStateMap()
        },
        setState(name, callback = false) {
            setState(name, callback)
        },
        numEnum: _numEnum
    }
    return obj
}

let state = _state()

module.exports = state;