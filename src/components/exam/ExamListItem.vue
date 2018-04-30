<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>{{ exam.name }}</span>
      <el-tag :type="tagType">{{ tagContent }}</el-tag>
      <el-button v-if="isStudent && !exam.joined" style="float: right; padding: 8px" type="primary" @click="dialog = true">参加考试</el-button>
      <el-button v-else style="float: right; padding: 8px" type="primary" @click="$router.push('/exam/' + exam.id)" plain>查看详情</el-button>
    </div>
    <el-dialog title="确认参加考试" :visible.sync="dialog" width="30%">
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
      <el-col :span="6">
        <div class="grid-content bg-purple">编号：{{ exam.id }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">创建者：{{ exam.creator.username }}</div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple">起止时间：{{ exam.start_at | format }} 至 {{ exam.end_at | format }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-if="exam.url">
      <el-col :span="24">
        <div class="grid-content bg-purple" style="display: inline-block">试卷地址：<span id="exam-url">{{ exam.url }}</span></div>
        <el-button style="padding: 3px" type="primary" id="copy-btn" data-clipboard-target="#exam-url" plain>复制</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import Tool from '../../util/tool'

export default {
  props: {
    exam: Object
  },
  name: 'ExamListItem',
  methods: {
    join () {
      this.joining = true
      this.$http.post('/api/exam/' + this.exam.id + '/join').then(response => {
        this.$message.success({
          message: '参加考试成功！',
          center: true
        })
        this.joining = false
        this.dialog = false
        this.$emit('joined')
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
        this.joining = false
        this.dialog = false
      })
    }
  },
  computed: {
    isStudent: function () {
      return this.$store.state.user.role === 'STUDENT'
    },
    tagType: function () {
      switch (this.exam.status) {
        case 'UNAVAILABLE':
          return 'danger'
        case 'READY':
          return ''
        case 'AVAILABLE':
          return 'success'
        case 'FINISHED':
          return 'warning'
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
  data () {
    return {
      dialog: false,
      joining: false
    }
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
