# synchronized
    核心就是争夺monitor对象的所有权,monitorenter进入数+1,monitorexit进入数-1,直到为0。才可以被其他线程持有。  
    
    synchronized方法上会有一个特殊的标志位ACC_SYNCHRONIZED，会隐式调用上述两个指令
