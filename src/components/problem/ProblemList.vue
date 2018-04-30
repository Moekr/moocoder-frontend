<template>
    <main-container title="题目列表">
      <div style="margin-bottom: 10px; padding: 0 5px">
        <el-select v-model="typeInput" value="" @change="fetchData(1)">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-refresh" size="small" style="float: right" @click="fetchData(pageInfo.page)">刷新</el-button>
      </div>
      <el-table :data="problemList" style="height: 100%; width: 100%; flex:1; overflow-y: auto">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>{{ props.row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type | type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间">
          <template slot-scope="scope">
            <span>{{ scope.row.created_at | format }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push('/problem/' + scope.row.id)">详情</el-button>
            <el-button v-if="$store.state.cart.map(item => item.id).includes(scope.row.id)" type="danger" size="mini" @click="$store.commit('removeProblem', scope.row)">移出试题清单</el-button>
            <el-button v-else-if="isTeacher" type="success" size="mini" @click="$store.commit('addProblem', scope.row)">加入试题清单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" @current-change="fetchData" :total=pageInfo.total></el-pagination>
    </main-container>
</template>

<script>
import Tool from '../../util/tool'
import { mapGetters } from 'vuex'
import MainContainer from '../MainContainer'

export default {
  name: 'ProblemList',
  components: {
    MainContainer
  },
  methods: {
    fetchData (page) {
      this.$http.get('/api/problem?page=' + page + '&limit=30&type=' + this.typeInput).then(response => {
        this.pageInfo = response.body.page
        this.problemList = response.body.res
      }, response => {
        this.$message.error({
          message: response.status + ':' + response.statusText,
          center: true
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'isStudent',
      'isTeacher',
      'isAdmin'
    ])
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    },
    type: function (type) {
      switch (type) {
        case 'JAVA':
          return 'Java'
        case 'JAVA_COVERAGE':
          return 'Java覆盖测试'
        case 'PYTHON':
          return 'Python'
        case 'PYTHON_COVERAGE':
          return 'Python覆盖测试'
      }
      return type
    }
  },
  data () {
    return {
      typeOptions: [
        {label: '所有题目', value: ''},
        {label: 'Java', value: 'JAVA'},
        {label: 'Java覆盖测试', value: 'JAVA_COVERAGE'},
        {label: 'Python', value: 'PYTHON'},
        {label: 'Python覆盖测试', value: 'PYTHON_COVERAGE'}
      ],
      typeInput: '',
      pageInfo: {},
      problemList: []
    }
  },
  created () {
    this.fetchData(1)
  }
}
</script>

<style scoped>
  .el-pagination {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
</style>
