<template>
  <el-container>
    <el-header>
      <span class="brand">MOOCODER</span>
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link"><span>{{ username }}</span><i class="el-icon-arrow-down el-icon--right"></i></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'App',
  computed: {
    username: function () {
      return this.$store.state.user.username
    }
  },
  methods: {
    fetchUser () {
      this.$http.get('./api/user/current').then(response => {
        this.$store.commit('saveUser', response.body.res)
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    handleCommand (command) {
      switch (command) {
        case 'logout':
          window.location.href = './logout.html'
      }
    }
  },
  created () {
    this.fetchUser()
  }
}
</script>

<style scoped>
  .el-container {
    width: 100%;
    height: 100%;
  }
  .el-header {
    background-color: #409EFF;
    line-height: 60px;
  }
  .el-dropdown {
    float: right;
    cursor: pointer;
  }
  .brand {
    color: #606266;
  }
  .el-main {
    width: 100%;
    height: 100%;
    background-color: #f4f5f6;
  }
</style>
