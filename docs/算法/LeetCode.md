# LeetCode Hot

## 双指针



### 11. 盛最多水的容器

我们可以通过暴力的做法，得到第一个版本的代码

```java
class Solution {
    public int maxArea(int[] height) {
        int res = -1;
        int n = height.length;
        for(int i = 0; i < n; i++) {
            for(int j = i + 1; j < n; j++) {
                int minHeight = Math.min(height[i], height[j]);
                int length = j - i;
                int temp = minHeight * length;
                res = Math.max(res, temp);
            }
        }
        return res;
    }
}
```





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





