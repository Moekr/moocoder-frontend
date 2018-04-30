<template>
  <main-container>
    <div slot="title">
      <span style="display: inline-block; margin: 6px 0">题目详情</span>
      <div style="float: right">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/problem')">返回至列表</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
        <el-button v-if="$store.state.cart.map(item => item.id).includes(problem.id)" type="danger" size="small" @click="$store.commit('removeProblem', problem)">移出试题清单</el-button>
        <el-button v-else-if="isTeacher" type="success" size="small" @click="$store.commit('addProblem', problem)">加入试题清单</el-button>
        <el-button v-if="isAdmin || (problem.creator && problem.creator.id === $store.state.user.id)" type="danger" size="small" @click="dialog = true">删除题目</el-button>
      </div>
    </div>
    <el-dialog title="确认删除题目" :visible.sync="dialog" width="30%">
      <b>确认删除题目吗？</b>
      <p>题目ID：{{ problem.id }}</p>
      <p>题目名称：{{ problem.name }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="danger" @click="deleteProblem" :loading="loading">确定</el-button>
      </span>
    </el-dialog>
    <el-row>
      <el-col :span="2">
        <div class="grid-content">题目名称：</div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content">{{ problem.name }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content">题目类型：{{ problem.type | type }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">上传者：{{ problem.creator ? problem.creator.username : '系统' }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">上传时间：{{ problem.created_at | format }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div class="grid-content">题目描述：</div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content">{{ problem.description }}</div>
      </el-col>
    </el-row>
    <el-table :data="files" style="height: 100%; width: 100%; flex:1; overflow-y: auto">
      <el-table-column label="文件列表">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" disabled>更新文件</el-button>
        </template>
      </el-table-column>
    </el-table>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import { mapGetters } from 'vuex'
import MainContainer from '../MainContainer'

export default {
  name: 'ProblemDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('/api/problem/' + this.$route.params.problemId).then(response => {
        this.problem = response.body.res
        this.listFiles()
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    listFiles () {
      this.files = []
      this.problem.public_files.forEach(item => this.files.push({path: item, type: 'Public'}))
      this.problem.protected_files.forEach(item => this.files.push({path: item, type: 'Protected'}))
      this.problem.private_files.forEach(item => this.files.push({path: item, type: 'Private'}))
    },
    deleteProblem () {
      this.$store.commit('removeProblem', this.problem)
      this.loading = true
      this.$http.delete('/api/problem/' + this.$route.params.problemId).then(response => {
        this.$router.push('/problem')
      }, response => {
        this.loading = false
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'isStudent',
      'isTeacher',
      'isAdmin'
    ])
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    },
    type: function (type) {
      switch (type) {
        case 'JAVA':
          return 'Java'
        case 'JAVA_COVERAGE':
          return 'Java覆盖测试'
        case 'PYTHON':
          return 'Python'
        case 'PYTHON_COVERAGE':
          return 'Python覆盖测试'
      }
      return type
    }
  },
  watch: {
    '$route' (to, from) {
      this.fetchData()
    }
  },
  data () {
    return {
      problem: {},
      files: [],
      dialog: false,
      loading: false
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 24px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
</style>
