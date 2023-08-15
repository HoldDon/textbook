# ffmpeg

## 用法
``` bash
ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}...   
ffmpeg [选项] [[输入文件选项] -i 输入文件]... {[输出文件选项] 输出文件}...

# 设置视频/音频编码器 copy表示复制 例子 设置视频H.264编码 设置音频acc编码
-c:v libx264 -c:a aac 
# 设置视频/音频比特率 例子 视频1000kbps 设置音频128kbps 
-b:v 1000k  -b:a 128k 
# 设置分辨率 -s 宽度x高度
-s 1280x720
# 指定帧率为30
-r 30
# 指定视频滤镜的选项 -vf filter1=value1:param1=value2,filter2=value3:param2=value4
# 调整亮度(brightness)和对比度(contrast)的滤镜
-vf brightness=0.5:contrast=1.2 output.mp4

# 隐藏版本和版权信息
-hide_banner 
```

## 截取视频
``` bash
ffmpeg -i input.mp4 -ss 00:10:00 -t 00:01:00 -c:v libx264 -c:a copy output.mp4
```

## mp4转m3u8
``` bash
# hls_time 切片时长,hls_list_size 切片数量 0为无限制,hls_segment_filename 切片名称
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -hls_time 10 -hls_list_size 0 -hls_segment_filename "output_%03d.ts" output.m3u8
```

## 加水印
```
-vf "drawtext=text='水印':fontsize=24:x=(w-text_w-10):y=(h-text_h-10):fontcolor=white:box=1:boxcolor=black@0.5:fontfile=/path/to/font.ttf"
```

## 直播推流

```
ffmpeg -re -i 'input.mp4' -vcodec libx264 -acodec aac -f flv  rtmp://127.0.0.1:1938/live/test
```