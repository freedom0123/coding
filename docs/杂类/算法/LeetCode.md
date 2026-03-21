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





