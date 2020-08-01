# 链表算法

#### 链表反转

```java
    ListNode prev = null;
    while (head != null) {
        //临时节点
        ListNode tem = head.next;
        head.next = prev;
        prev = head;
        head = tem;
    }
```
递归
```java
    public ListNode recur(ListNode node) {
        if (node == null || node.next == null) {
            return node;
        }
        ListNode prev = recur(node.next);
        node.next.next = node;
        node.next = null;
        return prev;
    }
```

***
#### 练手
* [剑指 Offer 24. 反转链表](https://leetcode-cn.com/problems/fan-zhuan-lian-biao-lcof/)

