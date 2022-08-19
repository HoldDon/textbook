# 其他
### Flowable 
**启动时未生成表且报错：** 数据库链接上加参数 nullCatalogMeansCurrent=true  
**如果只需要流程主体,引入单个包即可:**
```xml
<dependency>
    <groupId>org.flowable</groupId>
    <artifactId>flowable-spring-boot-starter-process</artifactId>
    <version>${flowable.version}</version>
</dependency>
```
