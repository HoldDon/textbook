# 回文字符串

#### 方法一: 反转之后值相等
```
    string == string.reverse()
```
借助语言框架自带的字符串反转工具实现，最简单的方法

#### 方法二: 双指针

    核心思想是通过两个指针逐次判断对应位置的值是否相等,按遍历方向分为如下两种:

1. 首尾指针向中心
```java
    int size = s.length();
    int left = 0;
    int right = size - 1;
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
```
2. 中心指针向首尾
```java
    int size = s.length();
    int mid = size / 2;
    int mod = size % 2;
    int left = mid - 1;
    int right = mod == 0 ? (mid) : (mid + 1);
    while (left >= 0 && right < size) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left--;
        right++;
    }
    return true;
```

***
#### 已刷题目列表
* [125. 验证回文串](https://leetcode-cn.com/problems/valid-palindrome/solution/yan-zheng-hui-wen-chuan-by-leetcode-solution/)
* [680. 验证回文字符串 Ⅱ](https://leetcode-cn.com/problems/valid-palindrome-ii/)

