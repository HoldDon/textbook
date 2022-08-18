# 链表算法

#### 链表反转

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
#### 练手
* [剑指 Offer 24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)



#### 快慢指针

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



