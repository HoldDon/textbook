# 树相关算法

#### 深度遍历  

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

#### 广度遍历 
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

#### 镜像判断-递归法(即深度遍历) 
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


#### 前缀树
将一组前缀，通过多节点树的形式构建出来，每个节点的子节点集合可以通过数组(char值作为索引)、哈希表(char作为key)，节点保存完整前缀，如果只是路径的话存空值。

#### 二叉搜索树
节点的左子树只包含小于当前节点的数。  
节点的右子树只包含大于当前节点的数。  
所有左子树和右子树自身必须也是二叉搜索树。  

特性:**对一个二叉树进行中序遍历，如果是单调递增的，则可以说明这个树是二叉搜索树。**