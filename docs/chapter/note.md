## 记录

#### Spring Boot get请求中的特殊字符，报400 bad request

**原因：** Tomcat升级到9+版本之后，严格执行了`RFC 3986` 和 `RFC 7230`标准，参数中的字符串只能包含字母（a-zA-Z）、数字（0-9）、-_.~4个特殊字符。  
**解决办法：**
```java
@Bean
TomcatServletWebServerFactory webServerFactory() {
    TomcatServletWebServerFactory serverFactory = new TomcatServletWebServerFactory();
    //这里只解决了[]{}四个字符，如果有其他的，也可以再加入
    serverFactory.addConnectorCustomizers(
            connector -> connector.setProperty("relaxedQueryChars", "[]{}")
    );
    return serverFactory;
}
```

#### Flowable启动时未生成表且报错

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