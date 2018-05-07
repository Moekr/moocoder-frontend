<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>{{ exam.name }}</span>
      <el-tag :type="statusTagType">{{ statusTagContent }}</el-tag>
      <el-button v-if="isStudent && !exam.joined" class="join-button" type="primary" @click="dialog = true">参加考试</el-button>
      <el-button v-else class="join-button" type="primary" @click="$router.push('/exam/' + exam.id)" plain>查看详情</el-button>
    </div>
    <el-dialog title="确认参加考试" :visible.sync="dialog">
      <b>确认参加这场考试吗？</b>
      <p>考试名称：{{ exam.name }}</p>
      <p>创建者：{{ exam.creator.username }}</p>
      <p>起止时间：{{ exam.start_at | format }} 至 {{ exam.end_at | format }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取消</el-button>
        <el-button type="primary" @click="join" :loading="joining">确定</el-button>
      </span>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content">编号：{{ exam.id }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">创建者：{{ exam.creator.username }}</div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content">起止时间：{{ exam.start_at | format }} 至 {{ exam.end_at | format }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="exam.url">
      <el-col :span="4" v-if="isStudent">
        <div class="grid-content">成绩：{{ exam.result.score }}</div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content column-text">试卷地址：<span :id="'exam-url-' + exam.id">{{ exam.url }}</span></div>
        <el-button class="column-button" type="primary" id="copy-btn" :data-clipboard-target="'#exam-url-' + exam.id" plain>复制</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import Tool from '../../util/tool'
import { mapGetters } from 'vuex'

export default {
  props: {
    exam: Object
  },
  name: 'ExamListItem',
  methods: {
    join () {
      this.joining = true
      this.$http.post('./api/exam/' + this.exam.id + '/join').then(response => {
        this.$message.success({
          message: '参加考试成功！',
          center: true
        })
        this.joining = false
        this.dialog = false
        this.$emit('joined')
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
        this.joining = false
        this.dialog = false
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
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    }
  },
  data () {
    return {
      dialog: false,
      joining: false
    }
  }
}
</script>

<style scoped>
  .join-button {
    float: right;
    padding: 8px;
  }
</style>
