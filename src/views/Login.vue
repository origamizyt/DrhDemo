<template>
  <div>
    <form class='login-box' @submit='doLogin'>
      <h2>登录</h2>
      <div style='text-align: left;'>
        <label for='username' class='text-hint'>用户名 User Name:</label>
        <el-input v-model='username' id='username' clearable></el-input>
        <label for='password' class='text-hint'>密码 Password:</label>
        <el-input v-model='password' id='password' type='password' clearable></el-input>
      </div>
      <el-button native-type='submit' type='success' plain :loading='loading'>加入我们</el-button>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data: () => ({
      username: '',
      password: '',
      loading: false,
      logged: false
    }),
    asyncData: (resolve, reject) => {
      const loading = this.$loading({ lock: true });
      setTimeout(() => {
        loading.close();
      }, 2000);
      this.$http.get('http://127.0.0.1:5000/status')
      .then(response => response.json())
      .then(json => {
        resolve({
          logged: json.status
        })
      })
      .catch(e => reject(e));
    },
    methods: {
      doLogin(e) {
        e.preventDefault();
        this.loading = true;
        this.$http.post('http://127.0.0.1:5000/login', {
          user: this.username,
          password: this.password
        }, { emulateJSON: true })
        .then(response => response.json())
        .then(json => {
          this.loading = false;
          if (json.success) {
            this.$message({
              message: `欢迎您，${this.username}。`,
              type: 'success'
            })
            this.storage.tokenId = json.tokenId;
          }
          else this.$message.error('用户名或密码错误。')
        })
      }
    }
  }
</script>

<style scoped>
  .login-box {
    max-width: 350px;
    margin-left: auto;
    margin-right: auto;
  }
  .text-hint {
    color: #6c757d;
    font-size: .85rem;
  }
  .el-input {
    margin-top: 5px;
    margin-bottom: 10px;
  }
  .el-button[type=submit] {
    margin-top: 20px;
  }
</style>