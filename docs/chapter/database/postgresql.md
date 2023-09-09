# postgresql

## 基础知识


1. 函数

```sql
-- 字符串合并 string || string
select 'Post' || 'greSQL'; -- PostgreSQL
-- 替换字符串 overlay(string placing string from int [for int])
select overlay('Txxxxas' placing 'hom' from 2 for 4); -- Thomas
-- 指定分隔符合并字符串
select concat_ws(',', 'abcde', 2, NULL, 22); -- abcde,2,22
-- 判断时间是否重叠 
-- (start1, end1) OVERLAPS (start2, end2) 
-- (start1, length1) OVERLAPS (start2, length2)
SELECT (DATE '2001-02-16', DATE '2001-12-21') OVERLAPS
       (DATE '2001-10-30', DATE '2002-10-30');   -- true
```

2. 类型转换
```
type 'string'
'string'::type
CAST ( 'string' AS type )
```
1. `with`关键字，公共表表达式（Common Table Expression，CTE），用于创建可重复使用的临时表。

```sql
WITH expression_name [ (column_name [, ...] ) ] AS (
    query
)
SELECT ...

```

## 窗口函数

```sql
-- 聚合函数(sum avg min max) 专用函数(rank dense_rank row_number)
function_name OVER (<PARTITION BY column_name> <ORDER BY column_name>)
-- 示例
SELECT depname, empno, salary, ayg(salary) OVER (PARTITION BY depname) 
FROM empsalary;
```

## openGauss常用运维命令

```bash
# 查看数据库状态 cluster_state显示Normal表示正常
gs_om -t status
# 重启数据库
gs_om -t restart
# 登录数据库
gsql -d postgres -p 15400
```
