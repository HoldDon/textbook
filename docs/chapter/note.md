# 记录

## Spring Boot get请求中的特殊字符，报400 bad request

**原因：** Tomcat升级到9+版本之后，严格执行了`RFC 3986` 和 `RFC 7230`标准，参数中的字符串只能包含字母（a-zA-Z）、数字（0-9）、-_.~4个特殊字符。  
**解决办法：**
```java
@Bean
TomcatServletWebServerFactory webServerFactory() {
    TomcatServletWebServerFactory serverFactory
            = new TomcatServletWebServerFactory();
    serverFactory.addConnectorCustomizers(
            connector -> connector.setProperty("relaxedQueryChars", "[]{}")
    );
    return serverFactory;
}
```

## Flowable启动时未生成表且报错

**原因：** 数据库链接中缺少nullCatalogMeansCurrent，导致在所有库中检查表。  
**解决办法：** 设置数据库链接参数nullCatalogMeansCurrent=true，只在当前库中检查。
另外，如果只需要流程主体，引入单个包即可。  
```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-process</artifactId>
    <version>${flowable.version}</version>
</dependency>
```

## Flowable指定DataSource
**原因：** 有时业务库和流程库不在一起，需要隔离开。  
**解决办法：** 使用EngineConfigurationConfigurer，更改默认配置。
 
```java
@Bean
public EngineConfigurationConfigurer<SpringProcessEngineConfiguration> changeDataSource() {
    DataSource dataSource = DataSourceBuilder
            .create()
            .url("url")
            .username("username")
            .password("password")
            .type(DataSource.class)
            .driverClassName("driverClassName")
            .build();
    return (configuration -> configuration.setDataSource(dataSource));
}
```

## Minio与SpringBoot关于okhttp3的版本问题
**描述：** 启动时，出现NoClassDefFoundError报错。  
**原因：** Minio与SpringBoot 所以来的okhttp3版本不一致，导致初始化错误。  
**解决办法：** 在pom中指定与Minio依赖一直的okhttp3版本号。


## GIT-修改.gitignore文件后使之生效
```
git rm -r --cached .  #清除缓存  
git add . #重新trace file  
git commit -m "update .gitignore" #提交和注释  
git push origin master #可选，如果需要同步到remote上的话  
```

## SpringBoot 动态cron任务
 
```java
@Component
public class DynamicJob implements SchedulingConfigurer {

    private ScheduledTaskRegistrar scheduledTaskRegistrar;

    private Map<Long, ScheduledTask> taskMap = new HashMap<>(16);

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
        this.scheduledTaskRegistrar = scheduledTaskRegistrar;
        //此步重要，没有此方法，ScheduledTaskRegistrar尚未初始化，调度器和执行器都为空
        //返回的ScheduledTask会为空，但任务会在后续执行，导致无法控制
        this.scheduledTaskRegistrar.afterPropertiesSet();

        //此处可执行初始化操作
        this.addTask(1L, () -> System.out.println("任务1号,10秒一次:" + DateUtil.now()), "0/10 * * * * ?");
        this.addTask(2L, () -> System.out.println("任务2号,20秒一次:" + DateUtil.now()), "5/20 * * * * ?");

    }

    /**
     * 移除动态任务
     *
     * @param taskId 任务id
     */
    public void removeTask(Long taskId) {
        ScheduledTask task = taskMap.get(taskId);
        if (task != null) {
            task.cancel();
        }
    }

    /**
     * 新建任务
     *
     * @param taskId 任务id
     * @param method 执行方法
     * @param corn   corn表达式
     */
    public void addTask(Long taskId, Runnable method, String corn) {
        if (taskMap.containsKey(taskId)) {
            return;
        }
        CronTask cronTask = new CronTask(method, corn);
        ScheduledTask scheduledTask = scheduledTaskRegistrar.scheduleCronTask(cronTask);
        if (scheduledTask != null) {
            taskMap.put(taskId, scheduledTask);
        }
    }

    public static boolean isCronValid(String cron) {
        try {
            CronExpression.parse(cron);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
```


## bpnmn-js展现流程图并高亮指定节点
执行 yarn add bpmn-js
```js
import Viewer from 'bpmn-js/lib/Viewer';
import ModelingModule from 'bpmn-js/lib/features/modeling';
import 'bpmn-js/dist/assets/bpmn-js.css';

let viewer = new Viewer({
    container: '.bpmn-container',
    additionalModules: [ModelingModule]
});

try {
    //bpmn流程xml文件内容
    const xml = "";
    const { warnings } = await viewer.importXML(xml);

    var elementRegistry = viewer.get('elementRegistry');
    //获取任务id
    var shape = elementRegistry.get('userTaskId');
    let modeling = viewer.get('modeling');
    modeling.setColor(shape, {
        stroke: 'blue',
    });
} catch (err) {
    console.log('error rendering', err);
}

```

## Mybatis指定多个数据源

```java
/**
 * 指定Mapper包所在的位置以及引用的数据源
 */
@Configuration
@MapperScan(basePackages = {"com.hoe.port.mapper.xxx"}, sqlSessionFactoryRef = "xxxSqlSessionFactory")
public class XxxConfig {

    /**
     *   Primary注解 指定首要数据源
     *   prefix指定数据源配置的前缀
     * @return
     */
    @Bean(name = "xxxDataSource")
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource.xxx")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    /**
     *   指定SqlSessionFactory所属的数据源并设置类型别名的位置
     * @return
     */
    @Bean("xxxSqlSessionFactory")
    @Primary
    public SqlSessionFactory sqlSessionFactory(@Qualifier("xxxDataSource") DataSource dataSource) throws Exception {
        MybatisSqlSessionFactoryBean sqlSessionFactoryBean = new MybatisSqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setTypeAliasesPackage("com.hoe.port.entity.xxx");
        return sqlSessionFactoryBean.getObject();

    }
}
```



## 事务注解@Transactional嵌套异步@Async注解时，异步失效

事务关联的所有方法需要在一个线程下执行，遇到嵌套的异步注解时，异步失效

## jackson-xml处理列表嵌套

```java
/**
 * 注解
 */
@JacksonXmlElementWrapper(localName = "DataList")
@JacksonXmlProperty(localName = "DataItem")
private List<DataItem> dataList;
```
对应  
```xml
<DataList>  
    <DataItem>  
        <Item1>Item1</Item1>      
        <Item2>Item1</Item2>         
    <DataItem>  
</DataList> 
```

## 图片压缩工具

```java

import net.coobird.thumbnailator.Thumbnails;

/**
<dependency>
    <groupId>net.coobird</groupId>
    <artifactId>thumbnailator</artifactId>
    <version>0.4.20</version>
</dependency>
 */
public void compress(){
    File file = new File("/xx/xx/xx.png");
    Thumbnails.of(file)
        .scale(1f) //尺寸比例
        .outputQuality(0.3f) //压缩比例
        .toOutputStream(Files.newOutputStream("/target/xxx.png"));
}

```

## Node打包内存溢出

当执行node命令时，出现`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`错误。
```bash
export NODE_OPTIONS=--max_old_space_size=4069
```

## YOLOV8的结果进行plot()时出现中文乱码

下载 https://ultralytics.com/assets/Arial.Unicode.ttf 字体   
复制到 下列文件夹下
windows C:\Users\${user}\AppData\Roaming\Ultralytics\
linux   /root/.config/Ultralytics/

## knife4j-openapi接口路径问题

```yml
springdoc:
  api-docs:
    path: v3/api-docs # 此为相对路径  若前缀有/ 则为绝对路径
```