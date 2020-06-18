# 回溯算法

### 核心框架
```
result = []  
def backtrack(路径, 选择列表):  
    if 满足结束条件:
        result.add(路径)
        return

    for 选择 in 选择列表:
        做选择
        backtrack(路径, 选择列表)
        撤销选择
```

* [46.全排列](https://leetcode-cn.com/problems/permutations/)
* [17.电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)
