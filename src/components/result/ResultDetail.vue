<template>
  <main-container>
    <div slot="title">
      <span style="display: inline-block; margin: 6px 0">成绩详情</span>
      <div style="float: right">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/exam/' + result.exam.id + '/result')">返回至成绩列表</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </div>
    </div>
    <el-table :data="result.commits" style="height: 100%; width: 100%; flex:1; overflow-y: auto">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | format }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.finished ? '运行结束' : '等待或运行中' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="score" label="成绩" width="100"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push('/commit/' + scope.row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'ResultDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData: function () {
      this.$http.get('/api/result/' + this.$route.params.resultId).then(response => {
        this.result = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
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
      result: {}
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
