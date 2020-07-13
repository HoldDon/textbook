# 排序算法

#### 快速排序

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
#### 练手
* [912. 排序数组](https://leetcode-cn.com/problems/sort-an-array/)

