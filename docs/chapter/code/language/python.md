

# Python
## 环境配置
### pip

```python
# 2.x https://bootstrap.pypa.io/pip/2.7/get-pip.py
# 3.x https://bootstrap.pypa.io/get-pip.py
python get-pip.py

# 清华镜像
python -m pip install --upgrade pip
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```
## 基础语法
### 环境

`python -m venv xxx` 新建名为xxx的虚拟环境

### 方法

#### 参数
##### 默认参数
```python
def func(x, n=2):
    return x + n
```
##### 可变参数
```python
# args 为数组
def func(*args):
    result = 0
    for arg in args:
        result += arg
    return result

total = func(1, 2, 3)
```
##### 关键字参数
```python
# args 为字典
def func(**kwargs):
    for key, value in kwargs.items():
        print(key + ": " + value)

func(name="CaiXu", age="25", city="NanJing")
```

### 内置函数

| 函数             | 描述                                 |
| :--------------- | :-----------------------------       |
| `int(x [,base])` | 将x转换为一个整数 base为进制数         |
| `round(number, ndigits=None)` | 将x精确到小数点后指定位数 |
| `range(start, stop, step)` | start（可选，默认0），结束值（必选），步长（可选，默认为1） |
| `zip(*iterables)` | 将多个迭代对象打包，以最短的为长度 | 
| `all(iterable)` | 迭代对象中所有都为真，则输出True |
| `any(iterable)` | 迭代对象中任意为真，则输出True |


### 表达式


### 模块用法

- os
  - `os.path.splitext` 拆分后缀
  - `os.rename` 重命名
  - `os.listdir` 获取文件列表
  - `os.path.splitext(path)` 将文件名和后缀分开