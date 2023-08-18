# LeetCode

## 回溯算法

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
### 已刷题目列表

* [46.全排列](https://leetcode-cn.com/problems/permutations/)
* [17.电话号码的字母组合](https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number/)
* [78.子集](https://leetcode-cn.com/problems/subsets/)
* [90.子集](https://leetcode-cn.com/problems/subsets-ii/)


## 动态规划

### 核心框架
```
    //最值数组 可能是多维
    dp[] = new [];
    for(状态1 in 状态1集合){
        //可能有多个状态，跟最值数组对应
        dp[状态1] = 求最值(dp[选择1]);
    }

```
难点在于如何找到**状态转移方程**.  
初始值如何赋值
套路:       
1. 边界值处理       
2. 确定「状态」，也就是原问题和子问题中会变化的变量  
3. 确定「选择」，也就是导致「状态」产生变化的行为  
4. 明确 dp数组的定义
***  
### 已刷题目列表

## 链表算法

### 链表反转

```java
    //反转后的头部节点
    ListNode cur = null;
    while (head != null) {
        //临时保存下一个节点
        ListNode temp = head.next;
        //将之前反转好的链表 接在当前节点后面，实现反转
        head.next = cur;
        //当前头部节点赋值
        cur = head;
        //下一个节点
        head = temp;
    }
    return cur;
```
递归
```java
    public ListNode reverseList(ListNode head) {
        //递归截止条件
        if (head == null || head.next == null) {
            return head;
        }
        //递归取最末节点,即最终返回的头部
        ListNode temp = reverseList(head.next);
        //将当前节点接到下一节点之后，实现反转
        head.next.next = head;
        //断链
        head.next = null;
        return temp;
    }
```

***
### 练手
* [剑指 Offer 24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)



### 快慢指针

```java
    public int fastToSlow(ListNode head, int k) {
        ListNode fast = head;
        ListNode slow = head;
        //快指针先走k步，慢指针再走，适用于取链表间隔
        while (fast.next != null) {
            fast = fast.next;
            if (k > 1) {
                k--;
            } else {
                slow = slow.next;
            }
        }
        return slow.val;
    }
```

[返回倒数第 k 个节点](https://leetcode-cn.com/problems/kth-node-from-end-of-list-lcci/)

## 排序算法

### 快速排序

    分治思想
```java
    public int[] sortArray(int[] nums) {
        //以第一个数为基准点
        quickSort(nums,0,nums.length-1);
        return nums;
    }

    void quickSort(int nums[], int lo, int hi){
        //获取接下来要排序的高低位
        int i = lo, j = hi;
        int temp;
        if(i < j){
            //基准点
            temp = nums[i];
            //不断交换
            while (i != j)
            {
                //大于基准点的数字都在右侧
                while(j > i && nums[j] >= temp)-- j;
                nums[i] = nums[j];
                //小于基准点的数字都在左侧
                while(i < j && nums[i] <= temp)++ i;
                nums[j] = nums[i];
            }
            //找到基准点所处的位置，并赋值
            nums[i] = temp;
            //分别对基准点左右侧进行递归
            quickSort(nums, lo, i - 1);
            quickSort(nums, i + 1, hi);
        }
    }
```

***
### 练手
* [912. 排序数组](https://leetcode-cn.com/problems/sort-an-array/)



## 字符串算法

### 子序列判断  
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

### 回文字符串


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



## 树相关算法

### 深度遍历  

用递归来实现，调整下面代码代码中1、2、3的顺序，可以实现二叉树的遍历顺序

```java
public void dsf(TreeNode node) {
    if (node == null) {
        return;
    }
    //1.处理当前节点
    int x = node.val;
    //2.遍历左节点
    dsf(node.left);
    //3.遍历右节点
    dsf(node.right);
}
```

### 广度遍历 
用队列保存每层节点，然后遍历当前深度的队列数据，出队、入队

```java
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) {
        return result;
    }
    //构建队列保存当前深度的所有节点
    Queue<TreeNode> rank = new LinkedList<>();
    rank.add(root);
    while (!rank.isEmpty()) {
        int currentSize = rank.size();
        for (int i = 0; i < currentSize; i++) {
            TreeNode item = rank.remove();
            //每层的节点数据
            result.add(item.val);
            //从右侧遍历
            if (item.right != null) {
                rank.add(item.right);
            }
            if (item.left != null) {
                rank.add(item.left);
            }
        }
    }
    return result;
}
```

### 镜像判断-递归法(即深度遍历) 
判断树是否左右对称
```java
public boolean isSymmetric(TreeNode root) {
    return recur(root, root);
}

public boolean recur(TreeNode left, TreeNode right) {
    if (left == null && right == null) {
        return true;
    }
    if (left == null || right == null || left.val != right.val) {
        return false;
    }
    //左右子树对比
    return recur(left.right, right.left) && recur(right.left, left.right);
}
```
### 寻找最近公共祖先节点
递归不端判断左右子节点是否满足
```java
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }
        //左递归
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        //右递归
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        if (left == null) {
            return right;
        }
        if (right == null) {
            return left;
        }
        //左右都没找到
        return root;
    }
```

#### 前缀树
将一组前缀，通过多节点树的形式构建出来，每个节点的子节点集合可以通过数组(char值作为索引)、哈希表(char作为key)，节点保存完整前缀，如果只是路径的话存空值。

#### 二叉搜索树
节点的左子树只包含小于当前节点的数。  
节点的右子树只包含大于当前节点的数。  
所有左子树和右子树自身必须也是二叉搜索树。  

特性:**对一个二叉树进行中序遍历，如果是单调递增的，则可以说明这个树是二叉搜索树。**

***

## 其他算法

### 蓄水池抽样

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

### Boyer-Moore 投票算法

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

