# 应用性能管理

## Metrics 指标

### 启动 Prometheus

```bash
docker run --restart=unless-stopped -d -p 9090:9090 --network monitor_net \
--name prometheus \
-v /mnt/e/home/devops/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
prom/prometheus:v3.5.0
```

### 启动 victoriametrics

```bash
docker run -d --restart=unless-stopped -p 8428:8428 -v /home/victoria-metrics-data:/victoria-metrics-data  \
--name victoriametrics victoriametrics/victoria-metrics:v1.124.0 \
--selfScrapeInterval=5s -storageDataPath=victoria-metrics-data
```

### 采集器

#### **mysql-exporter**

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
docker run -d --restart=unless-stopped --network monitor_net --name=mysqld-exporter \
-v /mnt/e/home/devops/prometheus/my.cnf:/.my.cnf \
-p 9104:9104 prom/mysqld-exporter:v0.17.2
```

#### **categraf**
```bash
docker run -d  --name categraf \
        --restart=unless-stopped --network monitor_net  \
        --hostname categraf \
        -e TZ=Asia/Shanghai \
	    -e HOST_PROC=/hostfs/proc \
        -e HOST_SYS=/hostfs/sys \
        -e HOST_MOUNT_PREFIX=/hostfs \
        -v /home/flashcat/categraf/conf/:/etc/categraf/conf \
        -v /proc:/hostfs/proc:ro \
        -v /sys:/hostfs/sys:ro \
      flashcatcloud/categraf:latest
```

### 启动 nightingale

```toml
[DB]
# 单机模式使用 sqlite
DBType = "sqlite"
[Redis]
# 单机模式使用 miniredis
RedisType = "miniredis"
```

```bash
docker run -d --restart=unless-stopped --network monitor_net \
--name=nightingale -p 17000:17000 -p 20090:20090 \
-v /mnt/e/home/devops/n9e/config.toml:/app/etc/config.toml \
flashcatcloud/nightingale:8.2.2 sh -c "/app/n9e"
```
