# 多线程

## volatile
1. 数据发生更改后，立即从缓存回写到内存  
2. 回写操作会使得其他处理器的缓存无效

## synchronized
    核心就是争夺monitor对象的所有权,monitorenter进入数+1,monitorexit进入数-1,直到为0。才可以被其他线程持有。  
    synchronized方法上会有一个特殊的标志位ACC_SYNCHRONIZED，会隐式调用上述两个指令
#### 用法:
* 普通方法，锁当前实例
* 静态方法，锁当前类
* 代码块，锁括号里面的对象  
#### 