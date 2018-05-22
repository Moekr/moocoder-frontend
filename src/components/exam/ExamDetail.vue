<template>
  <main-container>
    <div slot="title">
      <span class="card-title-text">{{ exam.name }}</span>
      <div class="card-title-button">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/exam')">返回至列表</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
        <el-button v-if="isTeacher || isAdmin" type="primary" size="small" @click="$router.push('/exam/' + $route.params.examId + '/result')">查看学生成绩</el-button>
        <el-button v-if="isTeacher || isAdmin" type="danger" size="small" @click="dialog.delete = true">删除考试</el-button>
      </div>
    </div>
    <el-dialog title="确认删除考试" :visible.sync="dialog.delete">
      <b>确认删除考试吗？</b>
      <p>考试ID：{{ exam.id }}</p>
      <p>考试名称：{{ exam.name }}</p>
      <el-alert title="注意：所有与该场考试有关的提交数据都将被删除！" type="error" :closable="false"></el-alert>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.delete = false">取消</el-button>
        <el-button type="danger" @click="deleteExam" :loading="loading.delete">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改起止时间" :visible.sync="dialog.update">
      <p>原起止时间：</p>
      <p>{{ exam.start_at | format }} 至 {{ exam.end_at | format }}</p>
      <p>新起止时间：</p>
      <el-date-picker v-model="range" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      <p>注意：</p>
      <p>开始时间早于当前时间考试将立即开始</p>
      <p>开始时间晚于当前时间考试将回归未开始状态</p>
      <p>结束时间早于当前时间考试将立即结束并关闭</p>
      <p>考试关闭后将无法恢复</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.update = false">取消</el-button>
        <el-button type="primary" @click="updateExam" :loading="loading.update" :disabled="range.length !== 2">确定</el-button>
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
      <el-col v-if="isStudent || isTeacher" :span="6">
        <div v-if="exam.joined" class="grid-content button-row">{{ isTeacher ? '自测' : '' }}成绩：{{ result.score }}</div>
        <div v-else class="grid-content">
          <el-button type="primary" size="small" @click="joinExam" :loading="loading.join" :disabled="joinDisabled">生成自测试卷</el-button>
        </div>
      </el-col>
      <el-col :span="6" class="button-row">
        <div class="grid-content">
          <span>状态：</span>
          <el-tag size="mini" :type="statusTagType">{{ statusTagContent }}</el-tag>
        </div>
      </el-col>
      <el-col :span="12" class="button-row">
        <div class="grid-content column-text">起止时间：{{ exam.start_at | format }} 至 {{ exam.end_at | format }}</div>
        <el-button v-if="isTeacher || isAdmin" class="column-button" type="primary" @click="dialog.update = true" plain>修改</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="exam.url">
      <el-col :span="24">
        <div class="grid-content column-text">试卷地址：<span id="exam-url">{{ exam.url }}</span></div>
        <el-button class="column-button" type="primary" id="copy-btn" data-clipboard-target="#exam-url" plain>复制</el-button>
      </el-col>
    </el-row>
    <div class="fill-card top-divide">
      <div v-if="exam.problems && exam.problems.length">
        <el-row>
          <el-col>
            <b>题目列表：</b>
          </el-col>
        </el-row>
        <el-collapse accordion>
          <el-collapse-item v-for="problem in exam.problems" :key="problem.id" :name="problem.id">
            <template slot="title">
              {{ problem.name }}<el-tag class="problem-tag">{{ problem.type | problemTypeTagContent }}</el-tag>
            </template>
            <div>{{ problem.description }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <el-row v-if="exam.joined" style="margin-top: 12px;">
        <el-col>
          <b>提交记录：</b>
        </el-col>
      </el-row>
      <el-table v-if="exam.joined" :data="result.commits">
        <el-table-column prop="id" label="#" width="80"></el-table-column>
        <el-table-column label="提交时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | format }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.finished ? '运行结束' : '等待或运行中' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="成绩" width="120"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push('/commit/' + scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      this.$http.get('./api/exam/' + this.$route.params.examId).then(response => {
        this.exam = response.body.res
        if (!this.isAdmin && this.exam.joined) {
          this.fetchResult()
        }
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    fetchResult () {
      this.$http.get('./api/result/' + this.exam.result.id).then(response => {
        this.result = response.body.res
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    joinExam () {
      this.loading.join = true
      this.$http.post('./api/exam/' + this.$route.params.examId + '/join').then(response => {
        this.loading.join = false
        this.fetchData()
      }, response => {
        this.loading.join = false
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    updateExam () {
      this.loading.update = true
      this.$http.put('./api/exam/' + this.$route.params.examId, {
        start_at: this.range[0].getTime() / 1000,
        end_at: this.range[1].getTime() / 1000
      }).then(response => {
        this.range = []
        this.loading.update = false
        this.dialog.update = false
        this.fetchData()
      }, response => {
        this.loading.update = false
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    deleteExam () {
      this.loading.delete = true
      this.$http.delete('./api/exam/' + this.$route.params.examId).then(response => {
        this.$router.push('/exam')
      }, response => {
        this.loading.delete = false
        this.$message.error({
          message: Tool.errorMessage(response),
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
    statusTagType: function () {
      return Tool.examStatusToTagType(this.exam.status)
    },
    statusTagContent: function () {
      return Tool.examStatusToTagContent(this.exam.status)
    },
    joinDisabled: function () {
      return this.exam.status === 'UNAVAILABLE' ||
        this.exam.status === 'FINISHED' ||
        this.exam.status === 'CLOSED'
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    },
    problemTypeTagContent: function (type) {
      return Tool.problemTypeToTagContent(type)
    }
  },
  watch: {
    '$route' () {
      this.fetchData()
    }
  },
  data () {
    return {
      exam: {joined: true},
      result: {},
      range: [],
      dialog: {
        update: false,
        'delete': false
      },
      loading: {
        join: false,
        update: false,
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
  .top-divide {
    margin-bottom: 12px;
  }
  .problem-tag {
    margin-left: 10px;
  }
</style>
