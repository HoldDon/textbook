# postgresql

## 基础知识

### SQL

#### 继承
关键字`INHERITS`
```sql
CREATE TABLE father (
  name       text,
  population real,
  elevation  int     -- (in ft)
);

CREATE TABLE child (
  state      char(2) UNIQUE NOT NULL
) INHERITS (father);
```

### 类型

#### JSON


### 函数

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

-- 手动释放空间
VACUUM FULL VERBOSE ANALYZE;
-- 查看可用扩展
SELECT * FROM pg_available_extensions;
-- 高效字符串索引
create index if not exists idx_table_on_column on 'table' using gin ('column' gin_trgm_ops)
```

### 类型转换
```
type 'string'
'string'::type
CAST ( 'string' AS type )
```
### 公共表表达式（Common Table Expression，CTE）

 `with`关键字,用于创建可重复使用的临时表。

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
# 以操作系统用户omm登录
# 查看数据库状态 cluster_state显示Normal表示正常
gs_om -t status
# 重启数据库
gs_om -t restart
# 登录数据库
gsql -d postgres -p 15400
```

```sql
-- 兼容的数据库的类型，默认A
-- 取值范围：A、B、C、PG，分别表示兼容O、MY、TD和POSTGRES
-- A兼容性下，数据库将空字符串作为NULL处理，数据类型DATE会被替换为TIMESTAMP(0) WITHOUT TIME ZONE。
SHOW SQL_COMPATIBILITY;

-- 只能在创建数据库的时候指定
CREATE DATABASE db_name WITH  ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C' DBCOMPATIBILITY  = 'PG';

-- 修改密码
ALTER USER user_name IDENTIFIED BY 'new_password' REPLACE 'old_password';
```

## 工具
### 数据迁移
#### pgloader