Welcome to the status wiki!

# 这是一个个人demo，严禁用于任何带有盈利性质用途，仅供学习参考

下面简介一下如何使用以及目前支持的功能

在脚本引入后新建状态：
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
