<template>
    <main-container title="用户列表">
      <div style="margin-bottom: 10px; padding: 0 5px">
        <el-input v-model="searchInput" placeholder="搜索用户名" style="width: 200px"></el-input>
        <div style="float: right">
          <el-button type="primary" icon="el-icon-search" size="small" @click="fetchData(1)">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData(pageInfo.page)">刷新</el-button>
        </div>
      </div>
      <el-dialog title="确认删除用户" :visible.sync="dialog" width="30%">
        <b>确认删除用户吗？</b>
        <p>用户ID：{{ selectedUser.id }}</p>
        <p>用户名：{{ selectedUser.username }}</p>
        <p>用户邮箱：{{ selectedUser.email }}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="danger" @click="deleteUser" :loading="loading">确定</el-button>
        </span>
      </el-dialog>
      <el-table :data="userList" style="height: 100%; width: 100%; flex:1; overflow-y: auto">
        <el-table-column prop="id" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="注册时间">
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
      <el-pagination background layout="prev, pager, next" @current-change="fetchData" :total=pageInfo.total></el-pagination>
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
      this.$http.get('/api/user?page=' + page + '&limit=30&search=' + this.searchInput).then(response => {
        this.pageInfo = response.body.page
        this.userList = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    selectUser (user) {
      this.selectedUser = user
      this.dialog = true
    },
    deleteUser () {
      this.$http.delete('/api/user/' + this.selectedUser.id).then(response => {
        this.dialog = false
        this.loading = false
        this.fetchData(this.pageInfo.page)
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
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

<style scoped>
  .el-pagination {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
</style>
