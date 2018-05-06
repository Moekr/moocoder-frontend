<template>
  <main-container>
    <div slot="title">
      <span class="card-title-text">学生成绩</span>
      <div class="card-title-button">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/exam/' + $route.params.examId)">返回至考试</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
      </div>
    </div>
    <e-charts :options="chartOptions"></e-charts>
    <div class="fill-card">
      <el-table :data="resultList">
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
        this.chartOptions.series[0].data = this.resultList.map(result => Math.floor(result.score / 10)).reduce((a, b) => { a[b]++; return a }, new Array(11).fill(0))
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
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
          data: ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99', '100']
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
    width: 100%;
  }
</style>
