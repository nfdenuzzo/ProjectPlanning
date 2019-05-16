import Vue from 'vue'
import httpClient from '../httpclient'
import dateUtil from '../helper/dateUtil'
import editableChecker from '../helper/editableChecker'

Vue.prototype.$httpClient = httpClient
Vue.prototype.$dateHelper = dateUtil
Vue.prototype.$editableChecker = editableChecker
