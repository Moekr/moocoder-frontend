<template>
  <main-container title="使用帮助">
    <div class="fill-card">
      <student-help-page v-if="isStudent"></student-help-page>
      <teacher-help-page v-if="isTeacher"></teacher-help-page>
    </div>
  </main-container>
</template>

<script>
import { mapGetters } from 'vuex'
import MainContainer from './MainContainer'
import StudentHelpPage from './help/StudentHelpPage'
import TeacherHelpPage from './help/TeacherHelpPage'

export default {
  name: 'HelpPage',
  components: {
    MainContainer,
    StudentHelpPage,
    TeacherHelpPage
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
