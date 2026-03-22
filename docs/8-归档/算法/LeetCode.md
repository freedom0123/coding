# LeetCode Hot

## 双指针

### 11. 盛最多水的容器

结果集的计算为：S = min(height[i], height[j]) * (j - i).

```java
class Solution {
    public int maxArea(int[] height) {
        int res = -1;
        int left = 0;
        int right = height.length - 1;
        while (left < right) {
            if (height[right] > height[left]) {
                res = Math.max(res, (right - left) * height[left]);
                left++;
            } else {
                res = Math.max(res, (right - left) * height[right]);
                right--;
            }
        }
        return res;
    }
}
```

### 15. 三数之和

```java
class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        int n = nums.length;
        Arrays.sort(nums);
        Set<Integer> executedSet = new HashSet<>();
        for (int i = 0; i < n; i++) {
            if (i != 0 && nums[i] == nums[i - 1]) {
                continue;
            }
            int left = i + 1;
            int right = n - 1;
            while (left < right) {
                int temp = nums[i] + nums[left] + nums[right];
                if (temp == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    do {
                        left++;
                    } while (left < right && nums[left] == nums[left - 1]);
                    do {
                        right--;
                    } while (right > left && nums[right] == nums[right + 1]);
                } else if (temp > 0) {
                    right--;
                } else {
                    left++;
                }
            }
        }
        return res;
    }
}
```

### 42.接雨水

原题链接：https://leetcode.cn/problems/trapping-rain-water/?envType=study-plan-v2&envId=top-100-liked

给定 `n` 个非负整数表示每个宽度为 `1` 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。

**示例 1：**

![img](https://assets.leetcode.cn/aliyun-lc-upload/uploads/2018/10/22/rainwatertrap.png)

```
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
```

![image-20260322223204744](asserts/image-20260322223204744.png)

```java
class Solution {
    public int trap(int[] height) {
        int n = height.length;
        int[] preMax = new int[n];
        int[] sufMax = new int[n];

        preMax[0] = height[0];
        for(int i = 1; i < n; i++) {
            preMax[i] = Math.max(height[i], preMax[i - 1]);
        }

        sufMax[n - 1] = height[n - 1];
        for(int i = n - 2; i >= 0; i--) {
            sufMax[i] = Math.max(height[i], sufMax[i + 1]);
        }

        int res = 0;
        for(int i = 0; i < n; i++) {
            res += Math.min(preMax[i], sufMax[i]) - height[i];
        }
        return res;
        
    }
}
```





