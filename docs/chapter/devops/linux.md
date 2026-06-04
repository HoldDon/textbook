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

# 测试TCP
sudo apt install netcat-openbsd
nc ip port

# 切片合并大文件
# 按每 100MB 切割，默认前缀为 x
split -b 100M large_file.iso
# 指定前缀为 part_，使用数字后缀
split -b 200M -d large_file.iso part_
# 均分为10份 使用数字后缀
split -n 10 -d large_file.iso part_
# 合并
cat part_* > large_file.iso
```

## 部署操作
### 挂载磁盘
以`/dev/vdb`挂载到`/mnt/data`为例，使用GPT格式  
#### 第一步 确认磁盘状态 
确认`/dev/vdb`的空间是空闲的
```bash
lsblk
```
#### 第二步 使用`parted`创建分区
```bash
# 1. 进入 parted 交互模式，操作 /dev/vdb 磁盘
sudo parted /dev/vdb
```
进入提示符后，依次输入如下命令
```bash
# 2. (parted) 提示符后，创建 GPT 分区表
# 警告：这会清除磁盘上已有的分区和数据，请确保这是你需要的操作
(parted) mklabel gpt
# 3. 创建一个主分区，使用磁盘的 0% 到 100% 全部空间
(parted) mkpart primary 0% 100%
# 4. 退出 parted 工具
(parted) quit
```
#### 第三步 检查新分区
操作完成后，再用 lsblk 看一下，应该就能看到一个 5TB 的 vdb1 分区了。
#### 第四步 格式化并挂载
```bash
# 1. 格式化为 ext4 文件系统
sudo mkfs.ext4 /dev/vdb1
# 2. 创建挂载点（挂载目录）
sudo mkdir -p /mnt/data
# 3. 临时挂载
sudo mount /dev/vdb1 /mnt/data
# 4. 查看是否挂载成功
df -h
```
#### 第五步 设置开机启动
```bash
# 1. 获取分区的UUID
sudo blkid /dev/vdb1
# 2. 编辑fstab文件
sudo nano /etc/fstab
# 3. 在文件末尾添加一行,将上述得到UUID填入
UUID=<你的UUID> /mnt/data ext4 defaults 0 2
# 4. 测试配置是否正确
sudo mount -a
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