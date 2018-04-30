<template>
  <main-container title="考试列表">
    <div style="margin-bottom: 10px; padding: 0 5px">
      <el-select v-model="statusInput" value="" @change="fetchData(1)">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-refresh" size="small" style="float: right" @click="fetchData(pageInfo.page)">刷新</el-button>
    </div>
    <div style="flex:1; overflow-y: auto">
      <exam-list-item v-for="exam in examList" :key="exam.id" :exam="exam" class="exam-list-item" @joined="fetchData(1)"></exam-list-item>
    </div>
    <el-pagination background layout="prev, pager, next" @current-change="fetchData" :total=pageInfo.total></el-pagination>
  </main-container>
</template>

<script>
import MainContainer from '../MainContainer'
import ExamListItem from './ExamListItem'

export default {
  name: 'ExamList',
  components: {
    MainContainer,
    ExamListItem
  },
  methods: {
    fetchData (page) {
      this.$http.get('/api/exam?page=' + page + '&status=' + this.statusInput).then(response => {
        this.pageInfo = response.body.page
        this.examList = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    }
  },
  data () {
    return {
      statusOptions: [
        {label: '所有考试', value: ''},
        {label: '已参加的', value: 'JOINED'},
        {label: '尚未开始', value: 'READY'},
        {label: '正在进行', value: 'AVAILABLE'},
        {label: '已结束', value: 'FINISHED'},
        {label: '已关闭', value: 'CLOSED'}
      ],
      statusInput: '',
      pageInfo: {},
      examList: []
    }
  },
  created () {
    this.fetchData(1)
  }
}
</script>

<style scoped>
  .exam-list-item {
    margin: 5px;
    height: 100%;
  }
  .el-pagination {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
</style>
