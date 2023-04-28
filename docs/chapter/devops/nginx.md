# nginx

## 多目录映射
``` 
server {
    listen       2233;
    server_name  localhost;

    location / {
        root   E:/document/dh-document/BladeX/vip/;
        index   index.html index.htm;
    }
}

server {
    listen       3333;
    server_name  localhost;

    location / {
        root   E:/document/maicong/;
        index   index.html index.htm;
    }
}

```