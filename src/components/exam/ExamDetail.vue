<template>
  <main-container>
    <div slot="title">
      <span style="display: inline-block; margin: 6px 0">{{ exam.name }}</span>
      <div style="float: right">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/exam')">返回至列表</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
        <el-button v-if="!isStudent" type="primary" size="small" @click="$router.push('/exam/' + $route.params.examId + '/result')">查看学生成绩</el-button>
        <el-button v-if="!isStudent" type="danger" size="small" @click="dialog = true">删除考试</el-button>
      </div>
    </div>
    <el-dialog title="确认删除考试" :visible.sync="dialog" width="30%">
      <b>确认删除考试吗？</b>
      <p>考试ID：{{ exam.id }}</p>
      <p>考试名称：{{ exam.name }}</p>
      <el-alert title="注意：所有与该场考试有关的提交数据都将被删除！" type="error" :closable="false"></el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="danger" @click="deleteExam" :loading="loading.delete">确定</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content">编号：{{ exam.id }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">创建者：{{ exam.creator ? exam.creator.username : '' }}</div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">创建时间：{{ exam.created_at | format }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-if="!isAdmin" :span="6">
        <div v-if="exam.joined" class="grid-content" style="margin: 6px auto">{{ isTeacher ? '自测' : '' }}成绩：{{ result.score }}</div>
        <div v-else class="grid-content">
          <el-button type="primary" size="small" @click="joinExam" :loading="loading.join">生成教师自测试卷</el-button>
        </div>
      </el-col>
      <el-col :span="6" style="margin: 6px auto">
        <div class="grid-content">
          <span>状态：</span>
          <el-tag size="mini" :type="tagType">{{ tagContent }}</el-tag>
        </div>
      </el-col>
      <el-col :span="12" style="margin: 6px auto">
        <div class="grid-content">起止时间：{{ exam.start_at | format }} 至 {{ exam.end_at | format }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="exam.url">
      <el-col :span="24">
        <div class="grid-content" style="display: inline-block">试卷地址：<span id="exam-url">{{ exam.url }}</span></div>
        <el-button style="padding: 3px" type="primary" id="copy-btn" data-clipboard-target="#exam-url" plain>复制</el-button>
      </el-col>
    </el-row>
    <div v-if="exam.problems && exam.problems.length" style="border-top: 1px solid #cdcdcd; padding: 12px 0">
      <el-row>
        <el-col>
          <b>题目列表：</b>
        </el-col>
      </el-row>
      <el-collapse accordion>
        <el-collapse-item v-for="problem in exam.problems" :key="problem.id" :name="problem.id">
          <template slot="title">
            {{ problem.name }}<el-tag style="margin-left: 10px">{{ problem.type }}</el-tag>
          </template>
          <div>{{ problem.description }}</div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-row v-if="exam.joined" style="padding-top: 12px">
      <el-col>
        <b>提交记录：</b>
      </el-col>
    </el-row>
    <el-table v-if="exam.joined" :data="result.commits" style="height: 100%; width: 100%; flex:1; overflow-y: auto">
      <el-table-column prop="id" label="#" width="50"></el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | format }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.finished ? '运行结束' : '等待或运行中' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="成绩" width="80"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push('/commit/' + scope.row.id)">详情</el-button>
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
  name: 'ExamDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('/api/exam/' + this.$route.params.examId).then(response => {
        this.exam = response.body.res
        if (!this.isAdmin && this.exam.joined) {
          this.fetchResult()
        }
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    fetchResult () {
      this.$http.get('/api/result/' + this.exam.result.id).then(response => {
        this.result = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    joinExam () {
      this.loading.join = true
      this.$http.post('/api/exam/' + this.$route.params.examId + '/join').then(response => {
        this.loading.join = false
        this.fetchData()
      }, response => {
        this.loading.join = false
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    },
    deleteExam () {
      this.loading.delete = true
      this.$http.delete('/api/exam/' + this.$route.params.examId).then(response => {
        this.$router.push('/exam')
      }, response => {
        this.loading.delete = false
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
    ]),
    tagType: function () {
      switch (this.exam.status) {
        case 'READY':
          return ''
        case 'AVAILABLE':
          return 'success'
        case 'FINISHED':
          return 'warning'
        case 'UNAVAILABLE':
          return 'danger'
      }
      return 'info'
    },
    tagContent: function () {
      switch (this.exam.status) {
        case 'PREPARING':
          return '准备中'
        case 'UNAVAILABLE':
          return '初始化失败'
        case 'READY':
          return '尚未开始'
        case 'AVAILABLE':
          return '正在进行'
        case 'FINISHED':
          return '已结束'
        case 'CLOSED':
          return '已关闭'
      }
      return '未知状态'
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    }
  },
  watch: {
    '$route' (to, from) {
      this.fetchData()
    }
  },
  data () {
    return {
      exam: {joined: true},
      result: {},
      dialog: false,
      loading: {
        join: false,
        'delete': false
      }
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
  .el-pagination {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
</style>
