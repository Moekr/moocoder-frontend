<template>
  <main-container>
    <div slot="title">
      <span class="card-title-text">学生成绩</span>
      <div class="card-title-button">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/exam/' + $route.params.examId)">返回至考试</el-button>
        <el-button type="primary" icon="el-icon-download" size="small" @click="download">下载成绩单</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </div>
    </div>
    <div>
      <e-charts :options="chartOptions"></e-charts>
      <div class="statistics">
        <p>总计人数：{{ totalStudents }}</p>
        <p>总计平均成绩：{{ totalAverage }}</p>
        <p>有效人数：{{ committedStudents }}</p>
        <p>有效平均成绩：{{ committedAverage }}</p>
        <p>满分人数：{{ fullScoreStudents }}</p>
        <p>满分比例：{{ fullScoreRatio }}</p>
        <p>及格人数：{{ passedStudents }}</p>
        <p>及格比例：{{ passedRatio }}</p>
      </div>
    </div>
    <div class="fill-card">
      <el-table height="100%" :data="resultList">
        <el-table-column prop="id" label="#" width="100"></el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">
            <span>{{ scope.row.owner.username }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后提交时间">
          <template slot-scope="scope">
            <span v-if="!scope.row.last_commit_at">没有提交记录</span>
            <span v-else>{{ scope.row.last_commit_at | format }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="成绩" width="100"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push('/result/' + scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </main-container>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'

export default {
  name: 'ResultList',
  components: {
    ECharts,
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('./api/exam/' + this.$route.params.examId + '/result').then(response => {
        this.resultList = response.body.res
        this.chartOptions.series[0].data =
          this.resultList.map(result => (result.last_commit_at ? Math.floor(result.score / 10) : -1) + 1)
            .reduce((a, b) => { a[b]++; return a }, new Array(12).fill(0))
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    download () {
      window.location.href = './file/result/' + this.$route.params.examId
    }
  },
  computed: {
    summary: function () {
      return this.resultList.map(result => result.score).reduce((a, b) => a + b, 0)
    },
    totalStudents: function () {
      return this.resultList.length
    },
    totalAverage: function () {
      return (this.summary / Math.max(this.totalStudents, 1)).toFixed(2)
    },
    committedStudents: function () {
      return this.resultList.map(result => result.last_commit_at ? 1 : 0).reduce((a, b) => a + b, 0)
    },
    committedAverage: function () {
      return (this.summary / Math.max(this.committedStudents, 1)).toFixed(2)
    },
    fullScoreStudents: function () {
      return this.resultList.map(result => result.score === 100 ? 1 : 0).reduce((a, b) => a + b, 0)
    },
    fullScoreRatio: function () {
      return (this.fullScoreStudents * 100 / Math.max(this.committedStudents, 1)).toFixed(2) + '%'
    },
    passedStudents: function () {
      return this.resultList.map(result => result.score >= 60 ? 1 : 0).reduce((a, b) => a + b, 0)
    },
    passedRatio: function () {
      return (this.passedStudents * 100 / Math.max(this.committedStudents, 1)).toFixed(2) + '%'
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    }
  },
  watch: {
    '$route' () {
      this.fetchData()
    }
  },
  data () {
    return {
      resultList: [],
      chartOptions: {
        tooltip: {
          show: true
        },
        xAxis: {
          data: ['未提交', '0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99', '100']
        },
        yAxis: {
          name: '人数'
        },
        series: [{
          type: 'bar',
          data: [],
          tooltip: {
            formatter: '{c}人'
          }
        }]
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style scoped>
  .echarts {
    height: 300px;
    width: 80%;
    display: inline-block;
  }
  .statistics {
    float: right;
    width: 20%;
  }
</style>
