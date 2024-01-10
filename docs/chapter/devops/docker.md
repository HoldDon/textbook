# docker

### 命令
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
- ps 查看所有运行中的容器 -a：查看所有状态的容器 -l：查看最后一次创建的容器
- port 查看容器的端口映射

### run参数

+ -i 可与容器进行交互
+ -t 在容器内指定终端
+ -d 后台运行
+ -P 使用容器内的随机端口映射到外部主机
+ -p host:container  指定主机到容器的端口映射
+ --name 指定容器名称
+ --network 指定网络 host表示跟主机一致
+ --rm 容器退出时，自动清理容器内的文件系统
+ -h HOSTNAME --hostname=HOSTNAME 设定容器的主机名
+ --dns=IP_ADDRESS  添加 DNS 服务器到容器   --dns-search=DOMAIN： 设定容器的搜索域
+ -u uid:gid 指定用户组
+ -e TZ=Asia/Shanghai  指定时区

### Dockerfile文件

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
**RUN/CMD** 用于执行命令，RUN在docker build时运行，CMD 在docker run 时运行  
**ENTRYPOIN** 类似CMD，在执行 docker run 的时候可以指定 ENTRYPOINT 运行所需的参数。仅最后一个生效  
**COPY/ADD** 复制命令，从本机文件复制到容器内的路径。ADD会讲压缩文件解压到目标路径，无法复制压缩文件，可能会使构建比较慢   
**VOLUME** 定义匿名数据卷，避免数据因为重启而丢失和容器不断变大  
**WORKDIR** 指定工作目录  
**EXPOSE** 声明端口  

### TIPS

```
// 安装脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
// 进入容器 权限不足时加上 -u 0
docker exec -ti container-name /bin/sh
// 构建本地镜像， -f 可指定Dockerfile文件地址，最后的.为上下文，也可指定路径
docker build -t name:tag .
// 运行容器
docker run -d -p 主:容 -v 主:容 --name name image:tag
// 容器提交为镜像
docker docker commit <container-id/name> <image-name>:<tag>
// 镜像导出为文件
docker save -o /path/image.tar <image-name>:<tag>
// 文件导入为镜像
docker load -i myimage.tar
```