<template>
  <main-container>
    <div slot="title">
      <span style="display: inline-block; margin: 6px 0">运行详情</span>
      <div style="float: right">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/commit/' + record.commit.id)">返回至提交</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </div>
    </div>
    <el-dialog title="控制台输出" :visible.sync="dialog" width="1080px">
      <pre><code style="height: 50vh">{{ record.console_output }}</code></pre>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span>状态：</span>
          <el-tag :type="record.status | tagType">{{ record.status | tagContent }}</el-tag>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="margin: 6px auto">错误用例数：{{ record.failures ? record.failures.length : 0 }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content" style="margin: 6px auto">分数：{{ record.score }}</div>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="dialog = true" size="small">查看控制台输出</el-button>
      </el-col>
    </el-row>
    <el-table :data="record.failures" style="height: 100%; width: 100%; flex:1; overflow-y: auto;border-top: 1px solid #cdcdcd">
      <el-table-column type="expand">
        <template slot-scope="props">
          <pre><code>{{ props.row.trace }}</code></pre>
        </template>
      </el-table-column>
      <el-table-column label="错误用例" prop="name"></el-table-column>
    </el-table>
  </main-container>
</template>

<script>
import MainContainer from '../MainContainer'

export default {
  name: 'RecordDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('/api/record/' + this.$route.params.recordId).then(response => {
        this.record = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    }
  },
  filters: {
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
      record: {},
      dialog: false
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
  pre code {
    overflow: auto;
    display: block;
    padding: 10px;
    line-height: 1.428571429;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #e5e5e5;
    border: 1px solid #ccc;
    border-radius: 0.5em;
    white-space: pre;
  }
</style>
