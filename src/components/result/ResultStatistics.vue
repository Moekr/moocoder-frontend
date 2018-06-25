<template>
  <main-container title="成绩统计">
    <div class="fill-card">
      <el-table height="100%" :data="resultList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="exam.id" label="考试编号" width="100"></el-table-column>
        <el-table-column prop="exam.name" label="考试名称"></el-table-column>
        <el-table-column prop="score" label="考试成绩" width="180"></el-table-column>
        <el-table-column label="百分比修正" width="150">
          <template slot-scope="scope">
            <el-input-number size="mini" :min="0" :max="100" :step="10" v-model="data[scope.row.exam.id].fix"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="top-divide">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content">已选场次：{{ selectedCount }}</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">已选平均成绩：{{ selectedAverage }}</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content">总计成绩：{{ selectedSummary }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content">总计场次：{{ totalCount }}</div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content">总计平均成绩：{{ totalAverage }}</div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <div>注：平均成绩按照<b>修正前</b>成绩计算，总计成绩按照<b>修正后</b>成绩计算，修正后成绩 = 修正前成绩 ÷ 100 × 百分比修正</div>
        </el-col>
      </el-row>
    </div>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'ResultStatistics',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('./api/result').then(response => {
        this.resultList = response.body.res
        this.resultList.forEach(item => { this.$set(this.data, item.exam.id, {selected: false, fix: 100}) })
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    handleSelectionChange (rows) {
      Object.keys(this.data).forEach(key => { this.data[key].selected = false })
      rows.forEach(item => { this.data[item.exam.id].selected = true })
    }
  },
  computed: {
    selectedCount: function () {
      return this.resultList.map(item => this.data[item.exam.id].selected ? 1 : 0).reduce((a, b) => a + b, 0)
    },
    selectedAverage: function () {
      return (this.resultList
        .map(item => this.data[item.exam.id].selected ? item.score : 0)
        .reduce((a, b) => a + b, 0) / Math.max(this.selectedCount, 1))
        .toFixed(2)
    },
    selectedSummary: function () {
      return this.resultList
        .map(item => this.data[item.exam.id].selected ? item.score / 100 * this.data[item.exam.id].fix : 0)
        .reduce((a, b) => a + b, 0)
        .toFixed(2)
    },
    totalCount: function () {
      return this.resultList.length
    },
    totalAverage: function () {
      return (this.resultList
        .map(item => item.score)
        .reduce((a, b) => a + b, 0) / this.totalCount)
        .toFixed(2)
    }
  },
  data () {
    return {
      resultList: [],
      data: {}
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
