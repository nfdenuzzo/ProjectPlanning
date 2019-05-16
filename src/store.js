import Vue from 'vue'
import Vuex from 'vuex'
import HttpClient from '@/httpclient'
import DateUtil from '@/helper/dateUtil'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    getGlobalLoad: state => state.globalLoad,
    getJobClocking_JobWorkCentreOnly: state => state.jobClocking_JobWorkCentreOnly,
    getEmployeeManagers: state => state.employeeManagers,
    getUserDepartments: state => state.userDepartments,
    getSelectedEmployees: state => state.selectedEmployees,
    getCurrentPlannedJobs: state => state.currentPlannedJobs,
    getSelectedTabDay: state => state.selectedTabDay,
    getTabDays: state => state.tabDays,
    getDaysInWeek: state => state.daysInWeek,
    getWeekEndingDay: state => state.weekEndingDay,
    getJobs: state => state.jobs,
    getProductiveTasks: state => state.productiveTasks,
    getNonProductiveTasks: state => state.nonProductiveTasks,
    getEmployees: state => state.employees,
    getWorkCentres: state => state.workCentres,
    getEmployeeByIndex: (state) => (index) => {
      const employee = state.employees[index]
      return employee
    }
  },
  state: {
    userDepartments: [],
    selectedEmployees: [],
    currentPlannedJobs: [],
    selectedTabDay: null,
    tabDays: [],
    apiErrors: [],
    jobs: [],
    productiveTasks: [],
    nonProductiveTasks: [],
    workCentres: [],
    employees: [],
    employeeManagers: [],
    globalLoad: false,
    daysInWeek: 0,
    weekEndingDay: 0, // 0 for sunday and 6 for saturday
    jobClocking_JobWorkCentreOnly: false
  },
  mutations: {
    setGlobalLoad (state, payload) {
      state.globalLoad = payload.load
    },
    addApiError (state, payload) {
      state.apiErrors.push(payload.error)
    },
    setInitialData (state, payload) {
      state.employees = payload.data.employees
      state.jobs = payload.data.jobs
      state.productiveTasks = payload.data.productiveTasks
      state.nonProductiveTasks = payload.data.nonProductiveTasks
      state.workCentres = payload.data.workCentres
      state.weekEndingDay = payload.data.weekEndingDay
      state.daysInWeek = payload.data.daysInWeek
      state.userDepartments = payload.data.userDepartments
      state.employeeManagers = payload.data.employeeManagers
      state.jobClocking_JobWorkCentreOnly = payload.data.jobClocking_JobWorkCentreOnly
    },
    setEmployees (state, payload) {
      state.employees = payload.employees
    },
    // This mutation will set the tab days(array) and the selected tab day
    setTabDays (state, payload) {
      state.tabDays = []
      const weekDay = DateUtil.helperGetWeekDay(payload.weekEndingDate)

      let dayIterate = null
      if (weekDay <= state.weekEndingDay) {
        dayIterate = DateUtil.helperSetWeekDay(state.weekEndingDay, payload.weekEndingDate)
      } else {
        dayIterate = DateUtil.helperAddWeeks(DateUtil.helperSetWeekDay(state.weekEndingDay, payload.weekEndingDate), 1)
      }
      for (let i = 0; i < state.daysInWeek; i++) {
        state.tabDays.unshift({
          day: dayIterate,
          dayTotal: 0
        })
        dayIterate = DateUtil.helperSubtractDays(dayIterate, 1)
      }
      // Set selected tab day
      state.selectedTabDay = state.tabDays[0].day
    },
    overrideTabDays (state, payload) {
      state.tabDays = payload.tabDays
    },
    setSelectedTabDay (state, payload) {
      state.selectedTabDay = payload.day
    },
    setCurrentPlannedJobs (state, payload) {
      state.currentPlannedJobs = payload.currentPlannedJobs
    },
    addSelectedEmployee (state, payload) {
      // First make sure the employee is not already selected
      const selectedEmployeeIndex = state.selectedEmployees.findIndex(item => item.id === payload.employee.id)
      const alreadySelected = selectedEmployeeIndex > -1

      if (alreadySelected) {
        return
      }

      state.selectedEmployees.push(payload.employee)
    },
    removeSelectedEmployee (state, payload) {
      const selectedEmployeeIndex = state.selectedEmployees.findIndex(item => item.id === payload.employee.id)

      if (selectedEmployeeIndex > -1) {
        state.selectedEmployees.splice(selectedEmployeeIndex, 1)
      }
    },
    setSelectedEmployees (state, payload) {
      state.selectedEmployees = payload.employees
    },
    setWorkCentres (state, payload) {
      state.workCentres = payload.workCentres
    }
  },
  actions: {
    async getPlannedEmployeeJobs (context) {
      await context.dispatch('fetchJobPlanningTotals').catch((error) => {
        return Promise.reject(error)
      })

      const employeeIds = context.getters.getSelectedEmployees.map(item => item.id)
      const date = context.getters.getSelectedTabDay
      return HttpClient.getPlannedEmployeeJobsRequest(employeeIds, date).then((response) => {
        context.commit({
          type: 'setCurrentPlannedJobs',
          currentPlannedJobs: response.data
        })
      })
    },
    async initializeAllData (context) {
      return HttpClient.initialDataRequest().then((response) => {
        context.commit({
          type: 'setInitialData',
          data: {
            employees: response.data.employees,
            productiveTasks: response.data.productiveTasks,
            nonProductiveTasks: response.data.nonProductiveTasks,
            workCentres: response.data.workCentres,
            jobs: response.data.jobs,
            weekEndingDay: response.data.weekEndingDay,
            daysInWeek: response.data.daysInWeek,
            userDepartments: response.data.departments,
            employeeManagers: response.data.employeeManagers,
            jobClocking_JobWorkCentreOnly: response.data.jobClocking_JobWorkCentreOnly
          }
        })
        context.commit({
          type: 'setTabDays',
          weekEndingDate: new Date() // Set to current date for now
        })
      })
    },
    fetchEmployees (context, payload) {
      return HttpClient.getEmployeesRequest(payload.filterType, payload.departmentId, payload.managerId).then((response) => {
        context.commit({
          type: 'setEmployees',
          employees: response.data
        })
      })
    },
    fetchJobPlanningTotals (context) {
      const employeeIds = context.getters.getSelectedEmployees.map(item => item.id)
      const dates = context.getters.getTabDays.map(item => item.day)

      return HttpClient.fetchJobPlanningTotalsRequest(employeeIds, dates).then((response) => {
        context.commit({
          type: 'overrideTabDays',
          tabDays: response.data
        })
      })
    },
    async addEmployeeJobPlanningAndReload (context, payload) {
      await HttpClient.addEmployeeJobPlanningRequest(payload.data).catch((error) => {
        // Return the rejected promise, and don't even go through with the rest of the method
        return Promise.reject(error)
      })
      return context.dispatch({
        type: 'getPlannedEmployeeJobs'
      })
    },
    async updateEmployeeJobPlanningAndReload (context, payload) {
      await HttpClient.updateEmployeeJobPlanningRequest(payload.data, payload.id).catch((error) => {
        // Return the rejected promise, and don't even go through with the rest of the method
        return Promise.reject(error)
      })
      return context.dispatch({
        type: 'getPlannedEmployeeJobs'
      })
    },
    async removeEmployeeJobPlanningAndReload (context, payload) {
      const employeeIds = context.getters.getSelectedEmployees.map(item => item.id)
      await HttpClient.removeEmployeeJobPlanningRequest(employeeIds, payload.id).catch((error) => {
        // Return the rejected promise, and don't even go through with the rest of the method
        return Promise.reject(error)
      })
      return context.dispatch({
        type: 'getPlannedEmployeeJobs'
      })
    },
    async swapPlanningAndReload (context, payload) {
      const employeeIds = context.getters.getSelectedEmployees.map(item => item.id)
      await HttpClient.swapPlanningRequest(employeeIds, payload.isDown, payload.id).catch((error) => {
        // Return the rejected promise, and don't even go through with the rest of the method
        return Promise.reject(error)
      })
      return context.dispatch({
        type: 'getPlannedEmployeeJobs'
      })
    }
  }
})
