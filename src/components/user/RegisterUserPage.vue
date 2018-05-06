<template>
  <main-container title="创建用户">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="fill-card">
      <el-form-item label="用户名" prop="username" class="form-input">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email" class="form-input">
        <el-input v-model="form.email" type="email" required></el-input>
      </el-form-item>
      <el-form-item label="身份" prop="role" class="form-input">
        <el-radio-group v-model="form.role">
          <el-radio label="STUDENT">学生</el-radio>
          <el-radio label="TEACHER">教师</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <div class="form-button">
          <el-button type="danger" @click="resetForm" plain>重置</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">创建用户</el-button>
        </div>
      </el-form-item>
    </el-form>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'RegisterUserPage',
  components: {
    MainContainer
  },
  methods: {
    resetForm () {
      this.$refs['form'].resetFields()
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.registerUser()
        } else {
          return false
        }
      })
    },
    registerUser () {
      this.loading = true
      this.$http.post('./api/user', this.form).then(response => {
        this.$router.push('/user')
      }, response => {
        this.$message.error({
          message: Tool.errorMessage(response),
          center: true
        })
        this.loading = false
      })
    }
  },
  data () {
    const emailRegex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
    let emailValidator = (rule, value, callback) => {
      if (!emailRegex.test(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: emailValidator, trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      },
      form: {},
      loading: false
    }
  }
}
</script>

<style scoped>
  .form-input {
    width: 480px;
  }
</style>
