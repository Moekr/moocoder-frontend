<template>
  <main-container title="修改密码">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="fill-card">
      <el-form-item label="原密码" prop="origin" class="form-input">
        <el-input v-model="form.origin" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password" class="form-input">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirm" class="form-input">
        <el-input v-model="form.confirm" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="form-button">
          <el-button type="danger" @click="resetForm" plain>重置</el-button>
          <el-button type="primary" @click="onSubmit" :loading="loading">修改密码</el-button>
        </div>
      </el-form-item>
    </el-form>
  </main-container>
</template>

<script>
import Tool from '../../util/tool'
import MainContainer from '../MainContainer'

export default {
  name: 'ChangePasswordPage',
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
          this.changePassword()
        } else {
          return false
        }
      })
    },
    changePassword () {
      this.loading = true
      this.$http.post('./api/user/password/change', this.form).then(response => {
        this.$message.success({
          message: '密码修改成功！',
          center: true
        })
        this.$refs['form'].resetFields()
        this.loading = false
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
    const passwordRegex = /^[0-9a-zA-Z_]{8,16}$/
    let passwordValidator = (rule, value, callback) => {
      if (!passwordRegex.test(value)) {
        callback(new Error('密码只能包含大小写字母、数字和下划线，且必须为8-16位'))
      } else {
        this.$refs.form.validateField('confirm')
        callback()
      }
    }
    let confirmValidator = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        origin: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: passwordValidator, trigger: ['change', 'blur'] }
        ],
        confirm: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: confirmValidator, trigger: ['change', 'blur'] }
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
