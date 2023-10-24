# CSS
## flex
一个典型的应用如下，左边定宽300px，右边填充剩余宽度。
```html
<div class="container">
  <div class="left"></div>
  <div class="right"></div>
</div>
<style>
.container {
  display: flex;
}
.left {
  width: 300px;
}
.right {
  flex: 1;
  width: 100%;
}
</style>
```