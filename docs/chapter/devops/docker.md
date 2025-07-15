# docker

## 命令
- pull  拉取镜像
- images 查看本地镜像
- search 查找镜像
- commit  提交容器副本 -m：提交的描述信息 -a：指定镜像作者
- tag 为镜像增加标签
- network create 创建一个docker网络  -d：网络类型bridge或overlay；network ls 查看网络列表
- build 构建镜像 -t：指定镜像名称 后续跟Dockerfile文件目录
- run  运行容器
- logs 查看容器内输出
- start/stop/restart 启动/停止/重启 容器
- attach/exec  进入容器，区别在于attach在退出终端时会停止容器，推荐使用exec
- import /export  导入/导出容器
- rm/rmi  删除 容器/镜像
- ps 查看所有运行中的容器 -a：查看所有状态的容器 -l：查看最后一次创建的容器 -s:显示占用空间
- port 查看容器的端口映射

## run参数

+ -i 可与容器进行交互
+ -t 在容器内指定终端
+ -d 后台运行
+ -P 使用容器内的随机端口映射到外部主机
+ -p host:container  指定主机到容器的端口映射
+ -v host:container  磁盘映射
+ --name 指定容器名称
+ --network 指定网络 host表示跟主机一致
+ --rm 容器退出时，自动清理容器内的文件系统
+ --restart 重启参数:no-默认不自动重启,always-总是重启,on-failure[:retry]非零状态时重启retry次数,unless-stopped非手动停止时重启
+ -h HOSTNAME --hostname=HOSTNAME 设定容器的主机名
+ --dns=IP_ADDRESS  添加 DNS 服务器到容器   --dns-search=DOMAIN： 设定容器的搜索域
+ -u uid:gid 指定用户组
+ -e TZ=Asia/Shanghai  指定时区
+ --cap-add=NET_RAW  允许容器使用原始套接字 可使ping正常运行

## Dockerfile文件

```docker 
FROM ubuntu
COPY hom* /mydir/
VOLUME ["<路径1>", "<路径2>"...]
WORKDIR <工作目录路径>
ENTRYPOINT ["nginx", "-c"] # 定参
CMD ["/etc/nginx/nginx.conf"] # 变参 
RUN echo foo > bar
EXPOSE <端口1> [<端口2>...]
```

**FROM** 指定运行的镜像  
**RUN/CMD** 用于执行命令，RUN在docker build时运行，CMD 在docker run 时运行 ，多个命令***尽量***在一个`RUN/CMD`内执行 
**ENTRYPOIN** 类似CMD，在执行 docker run 的时候可以指定 ENTRYPOINT 运行所需的参数。仅最后一个生效  
**COPY/ADD** 复制命令，从本机文件复制到容器内的路径。ADD会讲压缩文件解压到目标路径，无法复制压缩文件，可能会使构建比较慢   
**VOLUME** 定义匿名数据卷，避免数据因为重启而丢失和容器不断变大  
**WORKDIR** 指定工作目录  
**EXPOSE** 声明端口  

## 常用组件
+ minio
```bash
docker run -d -p 9000:9000 -p 9001:9001 \
-e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=adminpassw" \
--name minio minio/minio:RELEASE.2025-04-22T22-12-26Z  \
server /data --console-address ":9001"
```
+ redis
```bash
docker run -d -p 6379:6379 --name redis redis:latest redis-server \
--requirepass "yourpassw"
```


## TIPS

容器内部访问宿主的默认地址为`172.17.0.1`

```bash
# 安装脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
# 进入容器 权限不足时加上 -u 0
docker exec -ti container-name /bin/sh
# 构建本地镜像， -f 可指定Dockerfile文件地址，最后的.为上下文，也可指定路径
docker build -t name:tag .
# 运行容器
docker run -d -p 主:容 -v 主:容 --name name image:tag
# 更新容器
docker update --restart=always my_container
# 容器提交为镜像 
docker system prune (可选，释放容器的只读空间)
docker commit <container-id/name> <image-name>:<tag>
# 镜像导出为文件
docker save -o /path/image.tar <image-name>:<tag>
# 文件导入为镜像
docker load -i myimage.tar
# windows的WSL2中默认的宿主host不为172.17.0.1,需要使用如下命令来确认
ip route show default | awk '/default/ {print $3}'
```

## 安装英伟达cuda

[cuda](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html)

## 手动安装
1. 在 [download.docker.com](https://download.docker.com/linux/) 中选择对应的操作系统/版本/架构
2. 下载如下文件
   - `containerd.io_<version>_<arch>`
   - `docker-ce_<version>_<arch>`
   - `docker-ce-cli_<version>_<arch>`
   - `docker-buildx-plugin_<version>_<arch>`
   - `docker-compose-plugin_<version>_<arch>`
3. 执行安装
   ::: code-group
    ```bash [Debian]
    sudo dpkg -i ./containerd.io_<version>_<arch>.deb \
    ./docker-ce_<version>_<arch>.deb \
    ./docker-ce-cli_<version>_<arch>.deb \
    ./docker-buildx-plugin_<version>_<arch>.deb \
    ./docker-compose-plugin_<version>_<arch>.deb
    ```

    ```bash [Centos]
    sudo yum install ./containerd.io_<version>_<arch>.rpm \
    ./docker-ce_<version>_<arch>.rpm \
    ./docker-ce-cli_<version>_<arch>.rpm \
    ./docker-buildx-plugin_<version>_<arch>.rpm \
    ./docker-compose-plugin_<version>_<arch>.rpm
    ```
    :::
4. 执行验证
    ```bash
    sudo systemctl start docker
    or
    sudo service docker start
    # test
    sudo docker run hello-world
    ```

## 迁移目录
Docker 默认将数据存储在 `/var/lib/docker`。要更改这个目录，可以按照以下步骤进行：
1. 停止 Docker 服务：
```bash
sudo systemctl stop docker
```
2. 创建新的目录：
```bash
sudo mkdir -p /mnt/docker
```
3. 移动现有数据（可选）：
```bash
sudo mv /var/lib/docker/* /mnt/docker/
```
4. 编辑 Docker 配置文件：  
在 Docker 的配置文件中指定新的数据目录。通常，这个文件位于 /etc/docker/daemon.json。如果没有这个文件，可以创建.
```bash
{
    "data-root": "/mnt/docker"
}
```
5. 重启 Docker 服务：
```bash
sudo systemctl start docker
```
6. 验证更改：  
可以使用以下命令检查 Docker 是否正在使用新的数据目录：
```bash
docker info | grep "Docker Root Dir"
```

## 镜像源
在原来的镜像名前加上源地址，有白名单限制，并非所有镜像都可用。  
- `docker.m.daocloud.io`
- `dockerproxy.com`
在/etc/docker/daemon.json中加入registry-mirrors，没有文件则新建
```json
{
    "registry-mirrors":[
        "https://docker.mirrors.ustc.edu.cn", 
        "https://docker.m.daocloud.io"
    ]
}
```