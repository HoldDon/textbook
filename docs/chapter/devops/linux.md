# linux

## 常用命令

```bash
# 命令的实际安装目录
readlink -f /usr/bin/java
# 建立符号链接
ln -s /opt/apache-maven-3.9.5/bin/mvn /usr/bin/mvn
```

## 树莓派

```bash
# 打开
nano ~/.bashrc
# 修改
export PATH=$PATH:/path/to/your/dir
# 生效
source ~/.bashrc
```