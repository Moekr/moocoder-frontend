<template>
  <main-container>
    <div slot="title">
      <span class="card-title-text">题目详情</span>
      <div class="card-title-button">
        <el-button type="primary" icon="el-icon-back" size="small" @click="$router.push('/problem')">返回至列表</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchData">刷新</el-button>
        <el-button v-if="removeEnable" type="danger" size="small" @click="$store.commit('removeProblem', problem)">移出试题清单</el-button>
        <el-button v-else-if="addEnable" type="success" size="small" @click="$store.commit('addProblem', problem)">加入试题清单</el-button>
        <el-button v-if="deleteEnable" type="danger" size="small" @click="dialog.delete = true">删除题目</el-button>
      </div>
    </div>
    <el-dialog title="确认删除题目" :visible.sync="dialog.delete">
      <b>确认删除题目吗？</b>
      <p>题目ID：{{ problem.id }}</p>
      <p>题目名称：{{ problem.name }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.delete = false">取消</el-button>
        <el-button type="danger" @click="deleteProblem" :loading="loading.delete">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="更新题目文件" :visible.sync="dialog.update">
      <el-form label-width="40px">
        <el-form-item label="路径" prop="name">
          <div>{{ selectedFile }}</div>
        </el-form-item>
        <el-form-item label="文件" prop="file">
          <el-upload ref="file" action="" :auto-upload="false" :limit="1" :on-change="onFileChange" :on-remove="onFileChange">
            <el-button slot="trigger" size="small" type="primary">选取</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate">取消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading.update" :disabled="!updateFiles.length">确定</el-button>
      </span>
    </el-dialog>
    <el-row>
      <el-col :span="2">
        <div class="grid-content">题目名称：</div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content">{{ problem.name }}</div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content">题目类型：{{ typeTagContent }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">上传者：{{ problem.creator ? problem.creator.username : '系统' }}</div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content">上传时间：{{ problem.created_at | format }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="2">
        <div class="grid-content">题目描述：</div>
      </el-col>
      <el-col :span="22">
        <div class="grid-content">{{ problem.description }}</div>
      </el-col>
    </el-row>
    <div class="fill-card top-divide">
      <el-table height="100%" :data="files">
        <el-table-column label="文件列表">
          <template slot-scope="scope">
            <span>{{ scope.row.path }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="selectedFile = scope.row.path; dialog.update = true" :disabled="!updateEnable">更新文件</el-button>
          </template>
        </el-table-column>
      </el-table></div>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import { mapGetters } from 'vuex'
import MainContainer from '../MainContainer'

export default {
  name: 'ProblemDetail',
  components: {
    MainContainer
  },
  methods: {
    fetchData () {
      this.$http.get('./api/problem/' + this.$route.params.problemId).then(response => {
        this.problem = response.body.res
        this.listFiles()
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    listFiles () {
      this.files = []
      this.problem.public_files.forEach(item => this.files.push({path: item, type: 'Public'}))
      this.problem.protected_files.forEach(item => this.files.push({path: item, type: 'Protected'}))
      this.problem.private_files.forEach(item => this.files.push({path: item, type: 'Private'}))
    },
    deleteProblem () {
      this.$store.commit('removeProblem', this.problem)
      this.loading.delete = true
      this.$http.delete('./api/problem/' + this.$route.params.problemId).then(response => {
        this.$router.push('/problem')
      }, response => {
        this.loading.delete = false
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
      })
    },
    onFileChange (file, fileList) {
      this.updateFiles = fileList
    },
    cancelUpdate () {
      this.$refs['file'].clearFiles()
      this.updateFiles = []
      this.dialog.update = false
    },
    onSubmit () {
      this.loading.update = true
      let body = new FormData()
      body.append('path', this.selectedFile)
      body.append('file', this.updateFiles[0].raw)
      this.$http.put('./api/problem/' + this.$route.params.problemId, body).then(response => {
        this.$message.success({
          message: '更新成功！',
          center: true
        })
        this.loading.update = false
        this.dialog.update = false
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
        this.loading.update = false
      })
    }
  },
  computed: {
    ...mapGetters([
      'isStudent',
      'isTeacher',
      'isAdmin'
    ]),
    removeEnable: function () {
      return this.$store.state.cart.map(item => item.id).includes(this.problem.id)
    },
    addEnable () {
      return this.isTeacher && this.problem.modified_at
    },
    updateEnable: function () {
      const user = this.$store.state.user
      const creator = this.problem.creator
      return this.problem.modified_at && (this.isAdmin || (creator && creator.id === user.id))
    },
    deleteEnable: function () {
      return this.isAdmin || (this.problem.creator && this.problem.creator.id === this.$store.state.user.id)
    },
    typeTagContent: function () {
      return Tool.problemTypeToTagContent(this.problem.type)
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
      problem: {},
      files: [],
      selectedFile: '',
      updateFiles: [],
      dialog: {
        'delete': false,
        update: false
      },
      loading: {
        'delete': false,
        update: false
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
