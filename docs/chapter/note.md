# 记录

## Spring Boot get 请求中的特殊字符，报 400 bad request

**原因：** Tomcat 升级到 9+版本之后，严格执行了`RFC 3986` 和 `RFC 7230`标准，参数中的字符串只能包含字母（a-zA-Z）、数字（0-9）、-\_.~4 个特殊字符。  
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

## Flowable 启动时未生成表且报错

**原因：** 数据库链接中缺少 nullCatalogMeansCurrent，导致在所有库中检查表。  
**解决办法：** 设置数据库链接参数 nullCatalogMeansCurrent=true，只在当前库中检查。
另外，如果只需要流程主体，引入单个包即可。

```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-process</artifactId>
    <version>${flowable.version}</version>
</dependency>
```

## Flowable 指定 DataSource

**原因：** 有时业务库和流程库不在一起，需要隔离开。  
**解决办法：** 使用 EngineConfigurationConfigurer，更改默认配置。

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

## Minio 与 SpringBoot 关于 okhttp3 的版本问题

**描述：** 启动时，出现 NoClassDefFoundError 报错。  
**原因：** Minio 与 SpringBoot 所以来的 okhttp3 版本不一致，导致初始化错误。  
**解决办法：** 在 pom 中指定与 Minio 依赖一直的 okhttp3 版本号。

## GIT-修改.gitignore 文件后使之生效

```
git rm -r --cached .  #清除缓存
git add . #重新trace file
git commit -m "update .gitignore" #提交和注释
git push origin master #可选，如果需要同步到remote上的话
```

## SpringBoot 动态 cron 任务

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

## bpnmn-js 展现流程图并高亮指定节点

执行 yarn add bpmn-js

```js
import Viewer from "bpmn-js/lib/Viewer";
import ModelingModule from "bpmn-js/lib/features/modeling";
import "bpmn-js/dist/assets/bpmn-js.css";

let viewer = new Viewer({
  container: ".bpmn-container",
  additionalModules: [ModelingModule],
});

try {
  //bpmn流程xml文件内容
  const xml = "";
  const { warnings } = await viewer.importXML(xml);

  var elementRegistry = viewer.get("elementRegistry");
  //获取任务id
  var shape = elementRegistry.get("userTaskId");
  let modeling = viewer.get("modeling");
  modeling.setColor(shape, {
    stroke: "blue",
  });
} catch (err) {
  console.log("error rendering", err);
}
```

## Mybatis 指定多个数据源

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

## 事务注解@Transactional 嵌套异步@Async 注解时，异步失效

事务关联的所有方法需要在一个线程下执行，遇到嵌套的异步注解时，异步失效

## jackson-xml 处理列表嵌套

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

## Node 打包内存溢出

当执行 node 命令时，出现`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`错误。

```bash
export NODE_OPTIONS=--max_old_space_size=4069
```

## YOLOV8 的结果进行 plot()时出现中文乱码

下载 https://ultralytics.com/assets/Arial.Unicode.ttf 字体  
复制到 下列文件夹下
windows C:\Users\${user}\AppData\Roaming\Ultralytics\
linux /root/.config/Ultralytics/

## knife4j-openapi 接口路径问题

```yml
springdoc:
  api-docs:
    path: v3/api-docs # 此为相对路径  若前缀有/ 则为绝对路径
```

## MyBatis-Plus 多数据源使用 xml 时出现`Invalid bound statement (not found)`

**原因：** 在使用自定义的`@Configuration`注解配置`MybatisSqlSessionFactoryBean`时，`application.yaml`中的配置不起作用，需要指定`MapperLocations`  
**解决办法：**

```java{7}
@Bean("sqlSessionFactory")
@Primary
public SqlSessionFactory sqlSessionFactory(@Qualifier("dataSource") DataSource dataSource) throws Exception {
    MybatisSqlSessionFactoryBean sqlSessionFactoryBean = new MybatisSqlSessionFactoryBean();
    sqlSessionFactoryBean.setDataSource(dataSource);
    MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
    sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:/mapper/remote/**/*.xml"));
    return sqlSessionFactoryBean.getObject();
}
```

## SpringBoot中返回BigDecimal时，移除小数点后末尾多余的0

```java

@Slf4j
@AutoConfiguration(before = JacksonAutoConfiguration.class)
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer customizer() {
        return builder -> {
            // 全局配置序列化返回 JSON 处理
            JavaTimeModule javaTimeModule = new JavaTimeModule();
            javaTimeModule.addSerializer(BigDecimal.class, new BigDecimalTrim0Serializer());
            builder.modules(javaTimeModule);
            builder.timeZone(TimeZone.getDefault());
            log.info("初始化 jackson 配置");
        };
    }
}

public class BigDecimalTrim0Serializer extends JsonSerializer<BigDecimal> {
    @Override
    public void serialize(BigDecimal value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (value == null) {
            gen.writeNull();
        } else {
            // 使用 stripTrailingZeros() 移除末尾的 0
            gen.writeNumber(value.stripTrailingZeros());
        }
    }
}
```
## SpringBoot使用tomcat映射本地文件夹，通过nginx代理路径，文件名中包含`[]`字符时出现400错误
```yml
server:
  servlet:
    encoding:
      charset: UTF-8
      force: true
      force-request: true
      force-response: true
  tomcat:
    uri-encoding: UTF-8
    # 不拒绝非法字符（对于特殊文件名可能需要）
    relaxed-query-chars: '|,{,},[,],^'
    relaxed-path-chars: '|,{,},[,],^'
```

## maven的多模块项目中打包指定的模块
```bash
# 指定打包的模块 -pl指定模块 -am包含相关依赖
mvn clean package -pl parent-modules/biz-web -am
```