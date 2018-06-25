<template>
  <main-container title="考试列表">
    <div class="list-header">
      <el-select v-model="statusInput" value="" @change="fetchData(1)">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-refresh" class="list-header-button" @click="fetchData(pageInfo.page)">刷新</el-button>
    </div>
    <div class="fill-card">
      <exam-list-item v-for="exam in examList" :key="exam.id" :exam="exam" class="exam-list-item" @joined="fetchData(1)"></exam-list-item>
    </div>
    <el-pagination background layout="prev, pager, next" @current-change="fetchData" :page-size="20" :total=pageInfo.total></el-pagination>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import Options from '../../util/options'
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
      this.$http.get('./api/exam?page=' + page + '&limit=20&status=' + this.statusInput).then(response => {
        this.pageInfo = response.body.page
        this.examList = response.body.res
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    }
  },
  computed: {
    statusOptions: function () {
      return Options.examStatusOptions(this.$store.state.user.role)
    },
    statusInput: {
      get: function () {
        return this.$store.state.examStatus
      },
      set: function (examStatus) {
        this.$store.commit('examStatus', examStatus)
      }
    }
  },
  data () {
    return {
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
  }
</style>
