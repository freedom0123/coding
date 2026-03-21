# Timer

```java
/**     
* @param task   将要被执行的任务
* @param delay  任务将要被执行之前的间隔
* @param period 两次定时任务之间执行的间隔
*/
public void schedule(TimerTask task, long delay, long period) {
    if (delay < 0)
        throw new IllegalArgumentException("Negative delay.");
    if (period <= 0)
        throw new IllegalArgumentException("Non-positive period.");
    sched(task, System.currentTimeMillis()+delay, -period);
}
```

