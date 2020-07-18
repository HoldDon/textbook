# 抽样算法

#### 蓄水池抽样

    不断往后遍历时，按数量的概率覆盖之前的数据 1=100% 2=50% 3=33%  
    整体算下来，每个数字获取的概率为1/n  
    如果加上权重的话，把n换成累加的权重值，1换成每个项的权重
```java
    public int pick(int target) {
        Random r = new Random();
        int n = 0;
        int index = 0;
        for(int i = 0;i < nums.length;i++)
            if(nums[i] == target){
                n++;
                if(r.nextInt() % n == 0){
                    //随机替换
                    index = i;
                }
            }
        return index;
    }
```

***
#### 练手
* [398. 随机数索引](https://leetcode-cn.com/problems/random-pick-index/)
* [382. 链表随机节点](https://leetcode-cn.com/problems/linked-list-random-node/)
