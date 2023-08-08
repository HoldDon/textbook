# ffmpeg

## 用法
``` 
 ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}... 
 ffmpeg [选项] [[输入文件选项] -i 输入文件]... {[输出文件选项] 输出文件}...
```

## 直播推流

```
ffmpeg -re -i 'input.mp4' -vcodec libx264 -acodec aac -f flv  rtmp://127.0.0.1:1938/live/test

```