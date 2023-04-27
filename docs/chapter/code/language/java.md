

# Spring
## Spring Boot
### 定时任务

```java
@SpringBootApplication
//启用定时任务
@EnableScheduling 
public class MatchApplication {
	public static void main(String[] args) {
		SpringApplication.run(MatchApplication.class, args);
	}
}

@Component
public class XxxJob {

    //固定频率
    @Scheduled(fixedRate = 1000)
    public void fixedRate() {
    }

    //固定间隔 即每次方法执行完后等待指定时间
    @Scheduled(fixedDelay = 1000)
    public void fixedDelay() {
    }
    
    //按cron表达式来执行
    @Scheduled(cron = "")
    public void cron() {
    }
}
```


# 多线程

![An image](/lock-mind.jpg)

## volatile
1. 数据发生更改后，立即从缓存回写到内存  
2. 回写操作会使得其他处理器的缓存无效

## synchronized
    核心就是争夺monitor对象的所有权,monitorenter进入数+1,monitorexit进入数-1,直到为0。才可以被其他线程持有。  
    synchronized方法上会有一个特殊的标志位ACC_SYNCHRONIZED，会隐式调用上述两个指令
### 用法:
* 普通方法，锁当前实例
* 静态方法，锁当前类
* 代码块，锁括号里面的对象  

## CompletableFuture

| 静态方法 | 作用 |
| ---- | ---- |
| **supplyAsync** | 返回CompletableFuture&lt;U&gt;，有类型为U的返回值 |
| **runAsync** | 返回CompletableFuture&lt;Void&gt;，只执行，无返回值 |

上述两个静态方法创建后会立即执行。  

