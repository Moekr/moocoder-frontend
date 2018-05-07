// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import { Alert, Button, Card, Collapse, CollapseItem, Col, Container, DatePicker, Dialog, Dropdown,
  DropdownItem, DropdownMenu, Form, FormItem, Header, Input, Main, Menu, MenuItem, Message, Option, Pagination, Radio,
  RadioGroup, Row, Select, Table, TableColumn, Tag, Upload } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import "babel-polyfill"

console.log('Moocoder-frontend ver 0.1.1')
console.log('Maintainer: me@moekr.com')

Vue.config.productionTip = false

Vue.use(VueResource)

Vue.http.interceptors.push((request, next) => {
  // request.headers.set('Authorization', 'Basic ZGV2czoxMjM0NTY3OA==')
  // request.headers.set('Authorization', 'Basic ZGV2dDpNRFRJRDZ5Rnl6SkU=')
  // request.headers.set('Authorization', 'Basic cm9vdDoxMjM0NTY3OA==')
  next((response) => {
    if (response.status === 401) {
      window.location.href = './login.html'
    } else {
      return response
    }
  })
})

const components = [Alert, Button, Card, Collapse, CollapseItem, Col, Container, DatePicker, Dialog, Dropdown,
  DropdownItem, DropdownMenu, Form, FormItem, Header, Input, Main, Menu, MenuItem, Message, Option, Pagination, Radio,
  RadioGroup, Row, Select, Table, TableColumn, Tag, Upload]
components.forEach(item => {
  Vue.component(item.name, item)
})

Vue.prototype.$message = Message

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
