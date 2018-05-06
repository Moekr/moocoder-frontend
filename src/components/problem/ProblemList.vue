<template>
    <main-container title="题目列表">
      <div class="list-header">
        <el-select v-model="typeInput" value="" @change="fetchData(1)">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-refresh" class="list-header-button" @click="fetchData(pageInfo.page)">刷新</el-button>
      </div>
      <el-table :data="problemList" class="fill-card">
        <el-table-column type="expand">
          <template slot-scope="props">
            <div>{{ props.row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type | typeTagContent }}</span>
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
            <el-button v-if="removeEnable(scope.row)" type="danger" size="mini" @click="$store.commit('removeProblem', scope.row)">移出试题清单</el-button>
            <el-button v-else-if="addEnable(scope.row)" type="success" size="mini" @click="$store.commit('addProblem', scope.row)">加入试题清单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next" @current-change="fetchData" page-size="30" :total=pageInfo.total></el-pagination>
    </main-container>
</template>

<script>
import Tool from '../../util/tool'
import Options from '../../util/options'
import { mapGetters } from 'vuex'
import MainContainer from '../MainContainer'

export default {
  name: 'ProblemList',
  components: {
    MainContainer
  },
  methods: {
    fetchData (page) {
      this.$http.get('./api/problem?page=' + page + '&limit=30&type=' + this.typeInput).then(response => {
        this.pageInfo = response.body.page
        this.problemList = response.body.res
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    removeEnable (problem) {
      return this.$store.state.cart.map(item => item.id).includes(problem.id)
    },
    addEnable (problem) {
      return this.isTeacher && problem.modified_at
    }
  },
  computed: {
    ...mapGetters([
      'isStudent',
      'isTeacher',
      'isAdmin'
    ]),
    typeOptions: function () {
      return Options.problemTypeOptions(true)
    }
  },
  filters: {
    format: function (timestamp) {
      return Tool.formatTimestamp(timestamp)
    },
    typeTagContent: function (type) {
      return Tool.problemTypeToTagContent(type)
    }
  },
  data () {
    return {
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
