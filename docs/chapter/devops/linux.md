# linux

## 常用命令

```bash
# 支持中文
export LC_ALL=C.UTF-8
# 命令的实际安装目录
readlink -f /usr/bin/java
# 建立符号链接
ln -s /opt/apache-maven-3.9.5/bin/mvn /usr/bin/mvn
# 检查指定服务器端口是否开放
nc -zv <服务器IP地址> <端口号>

# 更改时区
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 网络请求
wget url #下载
curl url #只返回body
curl url #只返回res.header
curl url #返回req.header、res.header、body
```

## 运维组件
### Grafana
#### Prometheus 
##### 安装node_exporter  
1. 下载
```bash
wget https://github.com/prometheus/node_exporter/releases/download/vX.X.X/node_exporter-X.X.X.linux-amd64.tar.gz
```
2. 解压
```bash
tar xvfz node_exporter-X.X.X.linux-amd64.tar.gz
```
3. 复制
```bash
cd node_exporter-X.X.X.linux-amd64
sudo cp node_exporter /usr/local/bin
```
4. 创建系统服务
```bash
sudo nano /etc/systemd/system/node_exporter.service
```
加入
```bash
[Unit]
Description=Node Exporter
After=network.target

[Service]
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=default.target
```
5. 启动
```bash
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
```
浏览器中，访问`http://localhost:9100/metrics`


## 树莓派

```bash
# 打开
nano ~/.bashrc
# 修改
export PATH=$PATH:/path/to/your/dir
# 生效
source ~/.bashrc
```