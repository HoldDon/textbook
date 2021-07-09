# 其他算法

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

#### Boyer-Moore 投票算法

    在一堆数字中，求的数量最对的那个数字。类似于投票，选择票数最多的那个。
    具体就是从第一个数开始 c = 1，遇到相同的就加 1，遇到不同的就减 1，减到 0 就 重新换个数重新计数，最后的那个 m 即为所求众数。
    时间复杂度：O(n)  空间复杂度：O(1)
```java
    public int majorityElement(int[] nums) {
        int n = nums.length;
        //候选数
        int m = nums[0];
        //候选数的个数
        int c = 1;
        for (int i = 1; i < n; i++) {
            if (c == 0) {
                m = nums[i];
            }
            if (nums[i] == m) {
                c++;
            } else {
                c--;
            }
        }
        return m;
    }
```

***
#### 练手
* [面试题 17.10. 主要元素](https://leetcode-cn.com/problems/find-majority-element-lcci/)
