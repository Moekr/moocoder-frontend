<template>
    <main-container title="创建考试">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules" style="flex:1; overflow-x: hidden; overflow-y: auto">
        <el-form-item label="考试名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="起止时间" prop="range">
          <el-date-picker v-model="form.range" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="题目列表">
          <el-collapse accordion v-if="cart.length">
            <el-collapse-item v-for="problem in cart" :key="problem.id" :name="problem.id">
              <template slot="title">
                <span>{{ problem.name }}</span>
                <el-tag style="margin-left: 10px">{{ problem.type }}</el-tag>
              </template>
              <b>题目描述：</b>
              <div style="word-wrap: break-word; word-break: break-all;">{{ problem.description }}</div>
              <div style="display: inline-block; float: right; margin: 12px">
                <el-button type="danger" @click="$store.commit('removeProblem', problem)" size="mini">移除该题</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-alert v-else title="还没有选择题目，请到题目列表进行选择！" type="warning" close-text="立即前往"
                    @close="$router.push('/problem')" show-icon style="height: 40px" id="no-problem-alert"></el-alert>
        </el-form-item>
        <el-form-item>
          <div style="float: right">
            <el-button type="danger" @click="resetForm" plain>重置</el-button>
            <el-button type="primary" @click="onSubmit" :loading="loading" :disabled="disable">立即创建</el-button>
          </div>
        </el-form-item>
      </el-form>
    </main-container>
</template>

<script>
import MainContainer from '../MainContainer'

export default {
  name: 'CreateExamPage',
  components: {
    MainContainer
  },
  computed: {
    cart: function () {
      return this.$store.state.cart
    },
    disable: function () {
      return this.$store.state.cart.length === 0
    }
  },
  methods: {
    resetForm () {
      this.$refs['form'].resetFields()
      this.$store.commit('clearProblem')
    },
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http.post('/api/exam', {
            name: this.form.name,
            start_at: this.form.range[0].getTime() / 1000,
            end_at: this.form.range[1].getTime() / 1000,
            problems: this.$store.state.cart.map(item => item.id)
          }).then(response => {
            this.$store.commit('clearProblem')
            this.$router.push('/exam/' + response.body.res.id)
          }, response => {
            this.$message.error({
              message: response.status + ':' + response.statusText,
              center: true
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  },
  data () {
    let rangeValidator = (rule, value, callback) => {
      if (value.length === 2) {
        if (value[1] < new Date()) {
          callback(new Error('结束时间必须晚于当前时间'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请选择起止时间'))
      }
    }
    return {
      form: {
        name: '',
        range: []
      },
      rules: {
        name: [
          { required: true, message: '请输入考试名称', trigger: 'blur' }
        ],
        range: [
          { required: true, message: '请输入起止时间', trigger: 'blur' },
          { validator: rangeValidator, trigger: 'blur' }
        ]
      },
      loading: false
    }
  }
}
</script>

<style>
  #no-problem-alert .el-alert__closebtn {
    top: 0 !important;
  }
</style>
