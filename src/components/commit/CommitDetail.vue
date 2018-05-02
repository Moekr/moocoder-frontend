<template>
  <main-container>
    <div slot="title">
      <span style="display: inline-block; margin: 6px 0">提交详情</span>
      <div style="float: right">
        <el-button v-if="backToExam()" type="primary" icon="el-icon-back" size="small" @click="$router.push('/exam/' + commit.result.exam.id)">返回至考试</el-button>
        <el-button v-else type="primary" icon="el-icon-back" size="small" @click="$router.push('/result/' + commit.result.id)">返回至成绩</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content">编号：{{ commit.id }}</div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">提交时间：{{ commit.created_at | format }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">分数：{{ commit.score }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="grid-content">Git Commit ID：{{ commit.hash }}</div>
      </el-col>
    </el-row>
    <el-row style="border-top: 1px solid #cdcdcd; padding-top: 12px">
      <el-col>
        <b>测试运行情况：</b>
      </el-col>
    </el-row>
    <el-table :data="commit.records" style="height: 100%; width: 100%; flex:1; overflow-y: auto">
      <el-table-column label="题目">
        <template slot-scope="scope">
          <span>{{ scope.row.problem.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | tagType">{{ scope.row.status | tagContent }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分数" width="80"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push('/record/' + scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'CommitDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('/api/commit/' + this.$route.params.commitId).then(response => {
        this.commit = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    backToExam () {
      if (this.commit) {
        if (this.commit.result) {
          if (this.commit.result.owner) {
            return this.commit.result.owner.id === this.$store.state.user.id
          }
        }
      }
    }
  },
  computed: {
    isTeacher: function () {
      return this.$store.state.user.role === 'TEACHER'
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    },
    tagType: function (status) {
      switch (status) {
        case 'RUNNING':
          return ''
        case 'SUCCESS':
          return 'success'
        case 'UNSTABLE':
          return 'warning'
        case 'FAILURE':
        case 'TIMEOUT':
          return 'danger'
      }
      return 'info'
    },
    tagContent: function (status) {
      switch (status) {
        case 'SUCCESS':
          return '所有用例通过'
        case 'UNSTABLE':
          return '有用例未通过'
        case 'FAILURE':
          return '编译或运行失败'
        case 'TIMEOUT':
          return '运行超时'
        case 'WAITING':
          return '等待运行'
        case 'RUNNING':
          return '正在运行'
      }
      return '未知状态'
    }
  },
  watch: {
    '$route' (to, from) {
      this.fetchData()
    }
  },
  data () {
    return {
      commit: {}
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
</style>
