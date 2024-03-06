

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

### 参数

* `-Dfile.encoding=utf-8` 指定编码
* `-Duser.timezone=Asia/Shanghai` 指定时区

### 其他

1. nacos项目中启动服务出现`parse data from Nacos error,dataId:xxx.yml`错误，要在启动命令上加上编码：`java -Dfile.encoding=utf-8 -jar` 。


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

## ThreadLocal
### 介绍
ThreadLocal提供了线程的局部变量。线程局部变量与普通变量不同之处在于，访问线程局部变量的每个线程（通过get方法或set方法）都有它自己的独立初始化的变量副本。  



## 线程池

### 介绍

线程的创建和销毁开销较大，频繁的创建和销毁线程会影响程序性能。**利用基于池化思想的线程池来统一管理和分配线程，复用已创建的线程，避免频繁创建和销毁线程带来的资源消耗，提高系统资源的利用率。**  
优点：
* **降低资源消耗**，重复利用已经创建的线程，避免线程创建与销毁带来的资源消耗。
* **提高响应速度**，可以通过线程池直接获取线程，避免了创建线程带来的时间消耗。
* **便于管理线程**，统一管理和分配线程，避免无限制创建线程，另外可以引入线程监控机制。  
  
### 如何创建

#### **1.ThreadPoolExecutor**

```java
ExecutorService tpe = new ThreadPoolExecutor(
        10,
        20,
        30,
        TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(),
        Executors.defaultThreadFactory(),
        new ThreadPoolExecutor.AbortPolicy());
```   
参数依次为:
* `int corePoolSize`， **核心线程数**
* `int maximumPoolSize`， **最大线程数**
* `long keepAliveTime`， 非核心线程（最大线程数-核心线程数）的存活时间。
* `TimeUnit unit`， keepAliveTime的单位。
* `BlockingQueue<Runnable> workQueue`，任务队列，当所有的线程都忙时，任务在此等待。
* `ThreadFactory threadFactory`，线程工厂，指示如何新建线程。
* `RejectedExecutionHandler handler`，拒绝策略，当所有线程都忙，且任务队列已满时，如何处理加入的任务
    * `ThreadPoolExecutor.AbortPolicy`，默认策略，抛出`RejectedExecutionException`异常。
    * `ThreadPoolExecutor.CallerRunsPolicy`，直接使用提交任务的线程来执行被拒绝的任务。
    * `ThreadPoolExecutor.DiscardPolicy`，默默地丢弃被拒绝的任务，不会抛出任何异常。
    * `ThreadPoolExecutor.DiscardOldestPolicy`，丢弃最旧的未处理任务，并尝试再次提交被拒绝的任务。  
  

#### **2.Executors**

##### `Executors.newCachedThreadPool()`
```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                    60L, TimeUnit.SECONDS,
                                    new SynchronousQueue<Runnable>());
}
```
核心线程为0，有任务加入时才创建线程，线程数量无上限，所有线程只存活60秒，即线程缓存60秒。SynchronousQueue工作队列不存储任务，插入删除同步阻塞，即新加入的任务会立马获得/创建线程来执行。缺点是，如果短时间有大量任务涌入，系统就会出现非常多的线程，导致负载过重。
##### `Executors.newFixedThreadPool(10)`
```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>());
}
```
固定数量的线程池，核心线程数和最大线程数一致，创建时传入。LinkedBlockingQueue的长度为Integer.MAX_VALUE，即如果所有线程都忙，新加入的任务会一直在队列中等待。
##### `Executors.newSingleThreadExecutor()`
```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```
只有一个线程的线程池，所有加入的任务会顺序执行。
##### `Executors.newScheduledThreadPool(10)`
```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}

//super 为 ThreadPoolExecutor
public ScheduledThreadPoolExecutor(int corePoolSize) {
    super(corePoolSize, Integer.MAX_VALUE,
            DEFAULT_KEEPALIVE_MILLIS, MILLISECONDS,
            new DelayedWorkQueue());
}
```
创建一个定时执行任务的线程池，可以延迟或定期执行任务。不适用于需要实时执行任务的情况。

##### `Executors.newSingleThreadScheduledExecutor()`
```java
public static ScheduledExecutorService newSingleThreadScheduledExecutor() {
    return new DelegatedScheduledExecutorService
        (new ScheduledThreadPoolExecutor(1));
}
```
与上面`newScheduledThreadPool`一样，区别在于只创建一个线程。

##### `Executors.newWorkStealingPool()`
```java
public static ExecutorService newWorkStealingPool() {
    return new ForkJoinPool
        (Runtime.getRuntime().availableProcessors(),
            ForkJoinPool.defaultForkJoinWorkerThreadFactory,
            null, true);
}
```
使用`ForkJoinPool`来实现，其他5个使用的是`ThreadPoolExecutor`。内部通过 Work-Stealing 算法并行的处理任务，可以自动根据任务的类型和数量调整线程池的大小，窃取任务可能导致线程频繁切换，且无法保证任务的执行顺序。

##### 整体体系
![ScheduledThreadPoolExecutor](/ScheduledThreadPoolExecutor.png)


