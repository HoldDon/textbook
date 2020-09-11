# 回溯算法

### 核心框架
```java
result = [];  
void backtrack(路径, 选择列表){
    //这里可以做一些剪枝操作
    
    if 满足结束条件{
        result.add(路径)
        return;
     }

    for( 选择 in 选择列表){
        //这里也可以做一些剪枝操作
        
        做选择
        backtrack(路径, 选择列表)
        撤销选择
    }
}
```
***
#### 已刷题目列表

* [46.全排列](https://leetcode-cn.com/problems/permutations/)
* [17.电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)
