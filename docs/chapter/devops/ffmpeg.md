# ffmpeg

## 用法
``` bash
ffmpeg [options] [[infile options] -i infile]... {[outfile options] outfile}...   
ffmpeg [选项] [[输入文件选项] -i 输入文件]... {[输出文件选项] 输出文件}...

# 设置视频/音频编码器 copy表示复制 例子 设置视频H.264编码 设置音频acc编码
-c:v libx264 -c:a aac 
# 设置视频码率/音频比特率 例子 视频1000kbps 设置音频128kbps 
-b:v 1000k  -b:a 128k 
# 设置分辨率 -s 宽度x高度
-s 1280x720
# 指定帧率为30
-r 30
# 视频质量 值越小 文件越大
-crf 28
# 指定视频滤镜的选项 
# -vf filter1=value1:param1=value2,filter2=value3:param2=value4
# 裁剪:crop=640:480:10:10 值为 '宽:高:x:y' iw画面宽度  ih画面高度
# 缩放:scale=1280:720
# 模糊:boxblur 锐化:unsharp 左右翻转:hflip 
# 旋转:transpose=1 //90度
# 调整亮度(brightness)和对比度(contrast)的滤镜
-vf brightness=0.5:contrast=1.2 output.mp4

# 编码器的配置文件和级别 例子libx264有如下设置，可以使得推流直播更流畅
-profile:v main -level:v 3.1

# 隐藏版本和版权信息
-hide_banner 
```

### 获取视频信息
```bash
ffprobe -v quiet -print_format json -show_format -show_streams test.mp4
```

## 截取视频
``` bash
ffmpeg -i input.mp4 -ss 00:10:00 -t 00:01:00 -c:v libx264 -c:a copy output.mp4
```

## mp4转m3u8
``` bash
# hls_time 切片时长,hls_list_size 切片数量 0为无限制,hls_segment_filename 切片名称 -hls_base_url 可选，指定ts文件的路径前缀
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -hls_time 10 -hls_list_size 0 -hls_segment_filename "output_%03d.ts" output.m3u8
```

## 压缩视频
``` bash
# -c:v -c:a 分别指定视频/音频编码 也可以使用copy不重新编码
# -crf 指定压缩质量，数值越小，压缩后的视频质量越高，但文件大小也越大。一般建议使用 18-28 的范围
# -preset 指定压缩速度，可选值包括 veryfast、faster、fast、medium、slow、slower、veryslow建议使用 medium 或 slow。
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -crf 23 -preset medium output.mp4
```

## 加水印
```
-vf "drawtext=text='水印':fontsize=24:x=(w-text_w-10):y=(h-text_h-10):fontcolor=white:box=1:boxcolor=black@0.5:fontfile=/path/to/font.ttf"
```

## 缩略图

``` bash
# 多张预览
ffmpeg -hide_banner -i input.mp4 -an -vf "select='eq(pict_type,PICT_TYPE_I)',thumbnail" -vsync vfr -frames:v 10 output_%03d.jpg
# X宫格
ffmpeg -hide_banner -i input.mp4 -an -vf "select='eq(pict_type,PICT_TYPE_I)',thumbnail,scale=iw/2:-1,tile=2x2" -vsync vfr -frames:v 1 output.jpg
```

## 直播推流

```
ffmpeg -re -i 'input.mp4' -vcodec libx264 -acodec aac -f flv  rtmp://127.0.0.1:1938/live/test
```

## 硬件加速
```bash
# 查看支持的加速模式
ffmpeg -hwaccels
# 启用加速，nv显卡
ffmpeg -hwaccel cuda
```