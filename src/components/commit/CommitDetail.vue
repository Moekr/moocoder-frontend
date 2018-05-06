<template>
  <main-container>
    <div slot="title">
      <span class="card-title-text">提交详情</span>
      <div class="card-title-button">
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
    <el-row class="top-divide">
      <el-col>
        <b>测试运行情况：</b>
      </el-col>
    </el-row>
    <el-table :data="commit.records" class="fill-card">
      <el-table-column label="题目">
        <template slot-scope="scope">
          <span>{{ scope.row.problem.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusTagType">{{ scope.row.status | statusTagContent }}</el-tag>
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
import { mapGetters } from 'vuex'
import MainContainer from '../MainContainer'

export default {
  name: 'CommitDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('./api/commit/' + this.$route.params.commitId).then(response => {
        this.commit = response.body.res
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
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
    statusTagType: function (status) {
      return Tool.buildStatusToTagType(status)
    },
    statusTagContent: function (status) {
      return Tool.buildStatusToTagContent(status)
    }
  },
  watch: {
    '$route' () {
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
