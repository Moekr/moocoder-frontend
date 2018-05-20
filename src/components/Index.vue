<template>
  <div class="container">
    <el-card class="aside box-card">
      <el-menu default-active="/exam" router>
        <el-menu-item index="/exam">
          <icon name="regular/file-alt" scale="1.2"></icon>
          <span slot="title">考试</span>
        </el-menu-item>
        <el-menu-item v-if="isTeacher" index="/exam/create">
          <icon name="regular/plus-square" scale="1.2"></icon>
          <span slot="title">创建考试</span>
        </el-menu-item>
        <el-menu-item v-if="isTeacher || isAdmin" index="/problem">
          <icon name="regular/file-code" scale="1.2"></icon>
          <span slot="title">题目</span>
        </el-menu-item>
        <el-menu-item v-if="isTeacher || isAdmin" index="/problem/upload">
          <icon name="regular/plus-square" scale="1.2"></icon>
          <span slot="title">上传题目</span>
        </el-menu-item>
        <el-menu-item v-if="isAdmin" index="/user">
          <icon name="regular/user" scale="1.2"></icon>
          <span slot="title">用户</span>
        </el-menu-item>
        <el-menu-item v-if="isAdmin" index="/user/register">
          <icon name="regular/plus-square" scale="1.2"></icon>
          <span slot="title">创建用户</span>
        </el-menu-item>
        <el-menu-item index="/help">
          <icon name="regular/question-circle" scale="1.2"></icon>
          <span slot="title">帮助</span>
        </el-menu-item>
      </el-menu>
    </el-card>
    <router-view/>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import Icon from 'vue-awesome/components/Icon'
import Clipboard from 'clipboard'
import { mapGetters } from 'vuex'
import '../main.css'
import 'vue-awesome/icons/regular/file-alt'
import 'vue-awesome/icons/regular/plus-square'
import 'vue-awesome/icons/regular/file-code'
import 'vue-awesome/icons/regular/user'
import 'vue-awesome/icons/regular/question-circle'

let cb = new Clipboard('#copy-btn')
cb.on('success', function (e) {
  Message.success({
    message: '已复制到剪贴板！',
    center: true
  })
  e.clearSelection()
})
cb.on('error', function (e) {
  Message.error({
    message: '浏览器不支持复制到剪贴板！',
    center: true
  })
})

export default {
  name: 'Index',
  components: {
    Icon
  },
  computed: {
    ...mapGetters([
      'isStudent',
      'isTeacher',
      'isAdmin'
    ])
  }
}
</script>

<style scoped>
  .container {
    width: 1280px;
    height: 100%;
    display: flex;
    margin: 0 auto;
  }
  .aside {
    width: 270px;
    height: 100%;
    background-color: white;
  }
  .el-menu-item span {
    margin-left: 8px;
  }
</style>
