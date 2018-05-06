<template>
    <main-container title="上传题目">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="fill-card">
        <el-form-item label="题目名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择" value="">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目描述" prop="description">
          <el-input type="textarea" :rows="3" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="题目文件" prop="file">
          <el-upload ref="file" action="" :auto-upload="false" :limit="1" accept=".zip" :on-change="onFileChange" :on-remove="onFileChange">
            <el-button slot="trigger" size="small" type="primary">选取</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div class="form-button">
            <el-button type="danger" @click="resetForm" plain>重置</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading" :disabled="!files.length">上传</el-button>
          </div>
        </el-form-item>
      </el-form>
    </main-container>
</template>

<script>
import Tool from '../../util/tool'
import Options from '../../util/options'
import MainContainer from '../MainContainer'

export default {
  name: 'UploadProblemPage',
  components: {
    MainContainer
  },
  methods: {
    onFileChange (file, fileList) {
      this.files = fileList
    },
    resetForm () {
      this.$refs['form'].resetFields()
      this.$refs['file'].clearFiles()
      this.files = []
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.uploadProblem()
        } else {
          return false
        }
      })
    },
    uploadProblem () {
      this.loading = true
      let body = new FormData()
      let meta = new Blob([JSON.stringify(this.form)], {type: 'application/json'})
      body.append('meta', meta)
      body.append('data', this.files[0].raw)
      this.$http.post('./api/problem', body).then(response => {
        this.$router.push('/problem/' + response.body.res.id)
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
        this.loading = false
      })
    }
  },
  computed: {
    typeOptions: function () {
      return Options.problemTypeOptions()
    }
  },
  data () {
    return {
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入题目名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择题目类型', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入题目描述', trigger: 'blur' }
        ]
      },
      files: [],
      loading: false
    }
  }
}
</script>
