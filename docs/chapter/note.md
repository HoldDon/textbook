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

