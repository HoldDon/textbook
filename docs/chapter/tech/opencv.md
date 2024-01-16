# opencv

## 图片组成
图像由像素组成，每个像素为一个颜色点，许多的点汇聚成一个图像面。  
在计算机中以数组矩阵的形式处理图片，灰度/二值图片以二维数组存储（[行,列]），彩色图片为三维数组（[行,列,通道]），通道有三个，依次为b(蓝),g(绿),r(红)，每一个值为[0,225]之间的数字。

## 常用命令
```python
import cv2
import numpy as np

#下面都以这张图片作为案例
#读取图片
img = cv2.imread("dog.jpeg")

#二值/灰度为(行数,列数)，彩色为(行数,列数,通道数)
img.shape
#像素数目
img.size
#数据类型
img.dtype

#拆分bgr通道
b, g, r = cv2.split(dog)
#合并通道
cv2.merge([r, g, b])
```

## 图像运算
### 图像加法运算
```python
#对于8位二进制的像素点，直接相加会导致mod 256，
#使用add函数，是的值最大到255，实现提升饱和度的作用
img1 = cv2.add(img,img)
#加权相加
img3 = cv2.addWeighted(src1, 1, src2, 3, 3)
```
### 按位运算
```python
# 数据按二进制每一位进行计算
# 按位与
cv2.bitwise_and()
# 按位或
cv2.bitwise_or()
# 按位取反
cv2.bitwise_not()
# 按位异或 可用于加密解密
cv2.bitwise_xor()
```
### 图片分层
每个像素点有n(通道数)个8位二进制数字组成。  
对于每个数字均可提取出每个二进制位，填入像素矩阵，实现分层。  
用处：隐式水印（利用最后一位的分层矩阵，实现二值水印图像）
## 色彩转换
灰度公式:`Gray=0.299*R+0.587*G+0.114*B`
### 类型转换函数
```python
# 以彩色转灰度为例 
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
```
## 几何变换
```python
# 缩放
# dsize:目标尺寸 dst目标类型 fx横向缩放比例 fy纵向缩放比例 interpolation插值类型
cv2.resize(src, dsize, dst, fx, fy, interpolation)
# 翻转 flipCode：0上下翻转 1左右翻转 -1同时翻转
cv2.flip(img, flipCode)
# 仿射 平移+旋转
cv2.warpAffine
# 透视
cv2.warpPerspective
# 复制
cv2.remap
```
## 阈值处理
```python
cv2.threshold(src, thresh, maxval, type, dst)
```
## 图像平滑处理
过滤掉图像内部的噪声
### 均值滤波
以当前像素点为中心，取周围M*N个像素的平均值作为滤波均值。
```python
# ksize 是滤波核的大小 
# anchor 是锚点，其默认值是(-1, -1),表示中心
dst = cv2.blur( src, ksize, anchor, borderType )
```
### 方框滤波
与均值滤波相似，区别在于可用normalize设置使用像素均值还是总和
```python
# ddepth图像深度 默认-1 与原图相同
# ksize滤波核大小
# anchor 是锚点，其默认值是(-1, -1),表示中心
# normalize 表示在滤波时是否进行归一化 
dst = cv2.boxFilter( src, ddepth, ksize, anchor, normalize, borderType )
```
### 高斯滤波
求均值时加入权重值，离中心点越远，权重越小
```python
# ksize 是滤波核的大小
# sigmaX 是卷积核在水平方向上的标准差
# sigmaY 是卷积核在垂直方向上的标准差
# 计算公式: sigmaX = 0.3×[(ksize.width-1)×0.5-1] + 0.8
#          sigmaY = 0.3×[(ksize.height-1)×0.5-1] + 0.8
dst = cv2.GaussianBlur( src, ksize, sigmaX, sigmaY, borderType )
```
### 中值滤波
使用像素值的中间值来替代当前像素点的像素值，前面使用的是均值
```python
# ksize 是滤波核的大小
dst = cv2.medianBlur( src, ksize)
```
### 双边滤波
前面的滤波算法会导致图像边缘出现模糊，在双边滤波中，当处在边缘时，与当前点色彩相近的像素点会被给予较大的权重值；而与当前色彩差别较大的像素点会被给予较小的权重值，这样就保护了边缘信息。
```python
# d 是在滤波时选取的空间距离参数 推荐 d=5
# sigmaColor 是滤波处理时选取的颜色差值范围
# sigmaSpace 是坐标空间中的 sigma 值
dst = cv2.bilateralFilter( src, d, sigmaColor, sigmaSpace, borderType )
```
### 2D 卷积
使用自定义卷积核计算当前像素值
```python
# ddepth图像深度 默认-1 与原图相同
# kernel 是卷积核，是一个单通道的数组
# anchor 是锚点，其默认值是(-1, -1)
# delta 是修正值，它是可选项
dst = cv2.filter2D( src, ddepth, kernel, anchor, delta, borderType )
```
## 形态学操作
### 腐蚀
够将图像的边界点消除，使图像沿着边界向内收缩，
也可以将小于指定结构体元素的部分去除。  
例如：腐蚀操作可将原始图像内的毛刺腐蚀掉。 
```python
# kernel 代表腐蚀操作时所采用的结构类型
# anchor 代表 element 结构中锚点的位置。该值默认为(-1,-1)，在核的中心位置
# iterations 是腐蚀操作迭代的次数，该值默认为 1
dst = cv2.erode( src, kernel[, anchor[, iterations[, borderType[, borderValue]]]] )
```
### 膨胀
与腐蚀相反，可以扩大边界
```python
# ddepth图像深度 默认-1 与原图相同
# kernel 是卷积核，是一个单通道的数组
# anchor 是锚点，其默认值是(-1, -1)
# delta 是修正值，它是可选项
dst = cv2.dilate( src, kernel[, anchor[, iterations[, borderType[,borderValue]]]])
```
### 通用形态学函数
腐蚀操作和膨胀操作是形态学运算的基础，将腐蚀和膨胀操作进行组合
```python
# op 代表操作类型
dst = cv2.morphologyEx( src, op, kernel[, anchor[, iterations[, borderType[,borderValue]]]]] )
```
| 类型               | 说明           | 操作                                 |
| ------------------ | -------------- | ------------------------------------ |
| cv2.MORPH_ERODE    | 腐蚀           | erode(src)                           |
| cv2.MORPH_DILATE   | 膨胀           | dilate(src)                          |
| cv2.MORPH_OPEN     | 开运算         | dilate(erode(src))                   |
| cv2.MORPH_CLOSE    | 闭运算         | erode(dilate(src))                   |
| cv2.MORPH_GRADIENT | 形态学梯度运算 | dilate(src)-erode(src)               |
| cv2.MORPH_TOPHAT   | 顶帽运算       | src-open(src)                        |
| cv2.MORPH_BLACKHAT | 黑帽运算       | close(src)-src                       |
| cv2.MORPH_HITMISS  | 击中击不中     | intersection(erode(src),erode(srcI)) |

### 开运算
先将图像腐蚀，再对腐蚀的结果进行膨胀，可以实现去噪,即去除物体外部的毛刺
```python
opening = cv2.morphologyEx(img, cv2.MORPH_OPEN, kernel)
```
### 闭运算
先膨胀、后腐蚀的运算，可实现去除物体内部的小孔
```python
closing = cv2.morphologyEx(img, cv2.MORPH_CLOSE, kernel)
```
### 形态学梯度运算
用图像的膨胀图像减腐蚀图像的操作，该操作可以获取原始图像中前景
图像的边缘。
```python
result = cv2.morphologyEx(img, cv2.MORPH_GRADIENT, kernel)
```
### 礼帽运算
礼帽运算是用原始图像减去其开运算图像的操作。够获取图像的噪声信息。
```python
result = cv2.morphologyEx(img, cv2.MORPH_TOPHAT, kernel)
```
### 黑帽运算
黑帽运算是用闭运算图像减去原始图像的操作。能够获取图像内部的小孔。
```python
result = cv2.morphologyEx(img, cv2.MORPH_BLACKHAT, kernel)
```
### 核函数
上述所有的操作需要一个kernel，可以通过下面的函数生成
```python
# shape cv2.MORPH_RECT 矩形 cv2.MORPH_CROSS 十字结果 cv2.MORPH_ELLIPSE 椭圆
retval = cv2.getStructuringElement( shape, ksize[, anchor])
```
## 图像梯度
图像梯度计算的是图像变化的速度，即边缘部分像素值的变化梯度较大，可以得到更复杂的边缘信息。
### Sobel算子函数
```python
# x轴计算
x = cv2.Sobel(img, cv2.CV_64F, 0, 1)
x = cv2.convertScaleAbs(x)
# 轴计算
y = cv2.Sobel(img, cv2.CV_64F, 1, 0)
y = cv2.convertScaleAbs(y)
# 合并
z = cv2.addWeighted(x, 0.5, y, 0.5, 0)
```
### Scharr算子函数
精度更高
```python
# x轴计算
x = cv2.Scharr(img, cv2.CV_64F, 0, 1)
x = cv2.convertScaleAbs(x)
# 轴计算
y = cv2.Scharr(img, cv2.CV_64F, 1, 0)
y = cv2.convertScaleAbs(y)
# 合并
z = cv2.addWeighted(x, 0.5, y, 0.5, 0)
```
### Laplacian算子函数
```python
x = cv2.Laplacian(gray, cv2.CV_64F)
x = cv2.convertScaleAbs(x)
```
## Canny边缘检测
一种使用多级边缘检测算法检测边缘的方法
```python
# threshold1 表示处理过程中的第一个阈值
# threshold2 表示处理过程中的第二个阈值
edges = cv.Canny( image, threshold1, threshold2[, apertureSize[, L2gradient]])
```
## 图像金字塔
缩小放大图片
```python
# 向下采样
# dstsize 默认为原来的一半
dst = cv2.pyrDown( src[, dstsize[, borderType]] )
# 向上采样
# dstsize 默认为原来的两倍
dst = cv2.pyrUp( src[, dstsize[, borderType]] )
```
## 图像轮廓
```python
# 找出轮廓
cv2.findContours
# 画上轮廓
cv2.drawContours
# 轮廓矩
retval = cv2.moments( array[, binaryImage] )
# 计算轮廓的面积
retval =cv2.contourArea(contour [, oriented] ))
# 计算轮廓的长度
retval = cv2.arcLength( curve, closed )
# Hu矩函数
hu = cv2.HuMoments( m )
```
绘制轮廓
```python
# 矩形框
x,y,w,h = cv2.boundingRect( array )

retval =cv2.minAreaRect( points )
points = cv2.boxPoints( box )
```