<template>
  <el-container id='app'>
    <el-header>
      <el-menu :default-active='$route.path' mode="horizontal"
      background-color="#777"
      text-color="#fff"
      active-text-color="#aad04b"
      :router='true'>
        <el-menu-item index="/">
          DuRH 主页
        </el-menu-item>
        <el-menu-item index="/login">
          登录
        </el-menu-item>
        <el-menu-item index='/notice'>
          通知
        </el-menu-item>
      </el-menu>
    </el-header>
    <router-view/>
  </el-container>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
a {
  text-decoration: none;
}
#app {
  font-family: 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
code {
  font-family: 'Iosevka Extended', monospace;
  font-size: .9rem;
}
</style>
