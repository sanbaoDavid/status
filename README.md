Welcome to the status wiki!

# 这是一个个人demo，严禁用于任何带有盈利性质用途，仅供学习参考

###下面简介一下如何使用以及目前支持的功能

###新建状态
```javascript
state.newState('a', {
            condition: 10,
            conditionObject: this,
            conditionName: 'timer',
            compareEnum: '>',
            enfuncall: () => {
                console.log('进入11')
            },
            outfuncall: () => {
                console.log('出去11')
            },
        })
```
直接调用引入的state对象的newState方法，传入两个参数，一个是状态名称，另一个是各种需要的参数对象
* condition:被监听的变量需要达到的值，进而触发进入下一个状态
* conditionObject:被包含被监听变量所在的对象
* conditionName:被监听变量的名称
* compareEnum:只有被监听变量是数字类型才会用到的比较类型
* enfuncall:进入状态的回调
* outfuncall:退出状态的回调

###状态的删插查改
* `splice` 需传递一个参数就是要删除的状态名称
* `getState` 获取当前状态名称
* `insert` 插入状态
* `getStartState` 获取第一个状态名称
* `getEndState` 获取最后一个状态名称
* `logStateMap` 打印状态机的过程
* `setState` 设置状态机状态，带有两个参数，第一个是设置状态名称，第二个是是否执行状态进入的回调函数

###数字类型的比较枚举
`compareEnum`可以直接写：`state.numEnum.GREATER`
支持的比较类型：
```javascript
{
        GREATER: '>',
        GREATEREQUAL: '>=',
        LESS: '<',
        LESSEQUAL: '<=',
        EQUAL: '=='
    }
```

####啰嗦两句
优点我也不知道有啥，缺点目前比较明显：
* 被监听的变量只支持string，number，boolean
* 目前只能监听对象里的变量，但是数组里不行
  
说一下目前比较省事的地方吧：
* 被监听的变量，不管是在对象的原型里还是在对象里都可以找到，但只支持最外层的原型，再往里就不行了
* 被监听的变量如果已经有过重写的getset，可以不被影响的被监听（不会覆盖之前的getset）