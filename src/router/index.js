import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index'
import ExamList from '../components/exam/ExamList'
import ExamDetail from '../components/exam/ExamDetail'
import ResultList from '../components/result/ResultList'
import ResultDetail from '../components/result/ResultDetail'
import CreateExamPage from '../components/exam/CreateExamPage'
import CommitDetail from '../components/commit/CommitDetail'
import RecordDetail from '../components/record/RecordDetail'
import ProblemList from '../components/problem/ProblemList'
import ProblemDetail from '../components/problem/ProblemDetail'
import UploadProblemPage from '../components/problem/UploadProblemPage'
import UserList from '../components/user/UserList'
import RegisterUserPage from '../components/user/RegisterUserPage'
import HelpPage from '../components/HelpPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: '/exam',
      component: Index,
      children: [
        {
          path: 'exam',
          name: 'ExamList',
          component: ExamList
        },
        {
          path: 'exam/create',
          name: 'CreateExamPage',
          component: CreateExamPage
        },
        {
          path: 'exam/:examId',
          name: 'ExamDetail',
          component: ExamDetail
        },
        {
          path: 'exam/:examId/result',
          name: 'ResultList',
          component: ResultList
        },
        {
          path: 'result/:resultId',
          name: 'ResultDetail',
          component: ResultDetail
        },
        {
          path: 'commit/:commitId',
          name: 'CommitDetail',
          component: CommitDetail
        },
        {
          path: 'record/:recordId',
          name: 'RecordDetail',
          component: RecordDetail
        },
        {
          path: 'problem',
          name: 'ProblemList',
          component: ProblemList
        },
        {
          path: 'problem/upload',
          name: 'UploadProblemPage',
          component: UploadProblemPage
        },
        {
          path: 'problem/:problemId',
          name: 'ProblemDetail',
          component: ProblemDetail
        },
        {
          path: 'user',
          name: 'UserList',
          component: UserList
        },
        {
          path: 'user/register',
          name: 'RegisterUserPage',
          component: RegisterUserPage
        },
        {
          path: 'help',
          name: 'HelpPage',
          component: HelpPage
        }
      ]
    }
  ]
})
