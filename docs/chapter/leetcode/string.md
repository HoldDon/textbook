# 字符串算法

## 子序列判断  
####  双指针
 贪心匹配，大字符串指针不断右移，小字符串指针在匹配当前时才右移，如果遍历结束，小指针到了末尾则表示为子序列
```java
public boolean isSubsequence(String s, String t) {
    int sLen = s.length(), tLen = t.length();
    int i = 0, j = 0;
    while (i < sLen && j < tLen) {
        if (s.charAt(i) == t.charAt(j)) {
            //一旦匹配,小字符串往前移动
            i++;
        }
        //大字符串不断往前移动
        j++;
    }
    //长度相等，表示都匹配过了
    return i == sLen;
}
```

#### 已刷题目列表

* [392. 判断子序列](https://leetcode-cn.com/problems/is-subsequence/submissions/)

***  

## 回文字符串


####  反转之后值相等
```
    string == string.reverse()
```
借助语言框架自带的字符串反转工具实现，最简单的方法

####  双指针

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
#### 已刷题目列表
* [125. 验证回文串](https://leetcode-cn.com/problems/valid-palindrome/solution/yan-zheng-hui-wen-chuan-by-leetcode-solution/)
* [680. 验证回文字符串 Ⅱ](https://leetcode-cn.com/problems/valid-palindrome-ii/)

***