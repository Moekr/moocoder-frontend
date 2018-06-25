<template>
    <main-container title="用户列表">
      <div class="list-header">
        <el-input v-model="searchInput" placeholder="输入用户名" class="list-header-input"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="fetchData(1)">搜索</el-button>
        <div class="list-header-button">
          <el-button type="primary" icon="el-icon-refresh" @click="fetchData(pageInfo.page)">刷新</el-button>
        </div>
      </div>
      <el-dialog title="确认删除用户" :visible.sync="dialog">
        <b>确认删除用户吗？</b>
        <p>用户ID：{{ selectedUser.id }}</p>
        <p>用户名：{{ selectedUser.username }}</p>
        <p>用户邮箱：{{ selectedUser.email }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="danger" @click="deleteUser" :loading="loading">确定</el-button>
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
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="selectUser(scope.row)">删除用户</el-button>
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
    selectUser (user) {
      this.selectedUser = user
      this.dialog = true
    },
    deleteUser () {
      this.$http.delete('./api/user/' + this.selectedUser.id).then(response => {
        this.dialog = false
        this.loading = false
        this.fetchData(this.pageInfo.page)
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
        this.loading = false
      })
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
      dialog: false,
      loading: false
    }
  },
  created () {
    this.fetchData(1)
  }
}
</script>
