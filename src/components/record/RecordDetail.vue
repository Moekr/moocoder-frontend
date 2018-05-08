<template>
  <main-container>
    <div slot="title">
      <span class="card-title-text">运行详情</span>
      <div class="card-title-button">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/commit/' + record.commit.id)">返回至提交</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </div>
    </div>
    <el-dialog title="控制台输出" :visible.sync="dialog" width="1080px" class="console-output-dialog">
      <pre><code class="console-output-code">{{ record.console_output }}</code></pre>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content">
          <span>状态：</span>
          <el-tag :type="statusTagType">{{ statusTagContent }}</el-tag>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content button-row">错误用例数：{{ record.failures ? record.failures.length : 0 }}</div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content button-row">分数：{{ record.score }}</div>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="dialog = true" size="small">查看控制台输出</el-button>
      </el-col>
    </el-row>
    <el-table :data="record.failures" class="top-divide fill-card failure-table">
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
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'RecordDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('./api/record/' + this.$route.params.recordId).then(response => {
        this.record = response.body.res
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    }
  },
  computed: {
    statusTagType: function () {
      return Tool.buildStatusToTagType(this.record.status)
    },
    statusTagContent: function () {
      return Tool.buildStatusToTagContent(this.record.status)
    }
  },
  watch: {
    '$route' () {
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
  .console-output-code {
    height: 50vh;
  }
</style>

<style>
  .console-output-dialog .el-dialog__body {
    padding: 1px 15px;
  }
  .failure-table .el-table__expanded-cell {
    padding: 0 10px;
  }
</style>
