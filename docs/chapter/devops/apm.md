# 应用性能管理

## Metrics 指标
### 启动Prometheus
```bash
docker run -d -p 9090:9090 --network monitor_net \
--name prometheus \
-v /mnt/e/home/devops/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
prom/prometheus:v3.5.0
```
### 设置 mysql 的采集器  
对应的数据库中创建只读账号  
```sql
CREATE USER 'exporter'@'localhost' IDENTIFIED BY 'XXXXXXXX' WITH MAX_USER_CONNECTIONS 3;
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'localhost';
```
配置文件
```toml
[client]
host = localhost
port = 3306
user = exporter
password = XXXXXXXX
```
```bash
# 启动 mysql exporter
docker run -d --network monitor_net --name=mysqld-exporter \
-v /mnt/e/home/devops/prometheus/my.cnf:/.my.cnf \
-p 9104:9104 prom/mysqld-exporter:v0.17.2
```
### 启动nightingale
```toml
[DB]
# 单机模式使用 sqlite
DBType = "sqlite"
[Redis]
# 单机模式使用 miniredis
RedisType = "miniredis"
```
```bash
docker run -d  --network monitor_net \
--name=nightingale -p 17000:17000 -p 17000:17000 \
-v /mnt/e/home/devops/n9e/config.toml:/app/etc/config.toml \
flashcatcloud/nightingale:8.2.2 sh -c "/app/n9e"
```
