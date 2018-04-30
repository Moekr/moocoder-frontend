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

Vue.config.productionTip = false

Vue.use(VueResource)

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
