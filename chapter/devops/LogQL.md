## LogQL: Log Query Language

LogQL是受到PromQL启发的查询语言，使用Label与操作符进行日志过滤。

LogQL 查询有两种类型:

- 直接返回日志行内容
- 基于上述查询结果，重新计算后返回数据

## 日志查询语句

所有的LogQL查询语句包含一个日志流式选择器(log stream selector),包含一下四个部分:



- 解析

