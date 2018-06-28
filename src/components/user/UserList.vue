<template>
    <main-container title="用户列表">
      <div class="list-header">
        <el-input v-model="searchInput" placeholder="输入用户名" class="list-header-input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="fetchData(1)">搜索</el-button>
        <div class="list-header-button">
          <el-button type="primary" icon="el-icon-refresh" @click="fetchData(pageInfo.page)">刷新</el-button>
        </div>
      </div>
      <el-dialog :title="'确认'+action" :visible.sync="dialog">
        <b>确认{{ action }}吗？</b>
        <p>用户ID：{{ selectedUser.id }}</p>
        <p>用户名：{{ selectedUser.username }}</p>
        <p>用户邮箱：{{ selectedUser.email }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button :type="buttonType" @click="performAction" :loading="loading">确定</el-button>
        </span>
      </el-dialog>
      <div class="fill-card">
        <el-table height="100%" :data="userList">
          <el-table-column prop="id" label="#" width="50"></el-table-column>
          <el-table-column prop="username" label="用户名" width="150px"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column label="注册时间" width="150px">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at | format }}</span>
            </template>
          </el-table-column>
          <el-table-column label="身份" width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.role | role }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" @click="selectUser(scope.row, '重置密码')">重置密码</el-button>
              <el-button type="danger" size="mini" @click="selectUser(scope.row, '删除用户')">删除用户</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination background layout="prev, pager, next" @current-change="fetchData" :page-size="30" :total=pageInfo.total></el-pagination>
    </main-container>
</template>

<script>
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'UserList',
  components: {
    MainContainer
  },
  methods: {
    fetchData (page) {
      this.$http.get('./api/user?page=' + page + '&limit=30&search=' + this.searchInput).then(response => {
        this.pageInfo = response.body.page
        this.userList = response.body.res
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    selectUser (user, action) {
      this.selectedUser = user
      this.action = action
      this.dialog = true
    },
    performAction () {
      this.loading = true
      if (this.action === '重置密码') {
        this.resetPassword()
      } else if (this.action === '删除用户') {
        this.deleteUser()
      }
      this.loading = false
    },
    resetPassword () {
      this.$http.post('./api/user/' + this.selectedUser.id + '/password/reset').then(response => {
        this.$message.success({
          message: '重置密码成功！',
          center: true
        })
        this.dialog = false
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    deleteUser () {
      this.$http.delete('./api/user/' + this.selectedUser.id).then(response => {
        this.dialog = false
        this.fetchData(this.pageInfo.page)
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    }
  },
  computed: {
    buttonType: function () {
      if (this.action === '重置密码') {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    },
    role: function (role) {
      switch (role) {
        case 'STUDENT':
          return '学生'
        case 'TEACHER':
          return '教师'
      }
      return '未知'
    }
  },
  data () {
    return {
      searchInput: '',
      pageInfo: {},
      userList: [],
      selectedUser: {},
      action: '',
      dialog: false,
      loading: false
    }
  },
  created () {
    this.fetchData(1)
  }
}
</script>
