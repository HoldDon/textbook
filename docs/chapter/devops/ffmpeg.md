# ffmpeg

## 用法
``` 
ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}...   
ffmpeg [选项] [[输入文件选项] -i 输入文件]... {[输出文件选项] 输出文件}...

# 隐藏版本和版权信息
-hide_banner 
```

## 截取视频
```
ffmpeg -i input.mp4 -ss 00:10:00 -t 00:01:00 -c:v libx264 -c:a copy output.mp4
```

## 加水印
```
-vf "drawtext=text='水印':fontsize=24:x=(w-text_w-10):y=(h-text_h-10):fontcolor=white:box=1:boxcolor=black@0.5:fontfile=/path/to/font.ttf"
```

## 直播推流

```
ffmpeg -re -i 'input.mp4' -vcodec libx264 -acodec aac -f flv  rtmp://127.0.0.1:1938/live/test
```