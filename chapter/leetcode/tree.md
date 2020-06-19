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

#### 前缀树
将一组前缀，通过多节点树的形式构建出来，每个节点的子节点集合可以通过数组(char值作为索引)、哈希表(char作为key)，节点保存完整前缀，如果只是路径的话存空值。

