import config from './config'
import DateUtil from '../helper/dateUtil'

export default {
  // This will authenticate a user and return a token for him
  authenticateUserRequest (username) {
    const postData = {
      username
    }
    return config.axiosInstance.post('Auth/RosterAuth', postData)
  },
  initialDataRequest () {
    return config.axiosInstance.get('jobplanning/initial')
  },
  fetchJobPlanningTotalsRequest (employeeIds, dates) {
    const params = new URLSearchParams()
    employeeIds.forEach(function (id) {
      params.append('eid', id)
    })
    dates.forEach((date) => {
      params.append('d', DateUtil.helperStandardDateOnlyFormat(date))
    })
    return config.axiosInstance.get('jobplanning/totals', {
      params
    })
  },
  getEmployeesRequest (filterType, departmentId, managerId) {
    const params = {
      filterType,
      departmentId,
      managerId
    }
    return config.axiosInstance.get('employee', {
      params
    })
  },
  getJobWorkCentresRequest (job) {
    const params = {
      project: job
    }
    return config.axiosInstance.get('jobplanning/projectWorkCentres', {
      params
    })
  },
  getPlannedEmployeeJobsRequest (employeeIds, date) {
    const params = new URLSearchParams()
    params.append('date', DateUtil.helperStandardDateOnlyFormat(date))
    employeeIds.forEach(function (id) {
      params.append('eid', id)
    })
    return config.axiosInstance.get('jobplanning', {
      params
    })
  },
  addEmployeeJobPlanningRequest (data) {
    return config.axiosInstance.post('jobplanning', data)
  },
  updateEmployeeJobPlanningRequest (data, id) {
    return config.axiosInstance.put(`jobplanning/${id}`, data)
  },
  removeEmployeeJobPlanningRequest (employeeIds, id) {
    const params = new URLSearchParams()
    employeeIds.forEach(function (id) {
      params.append('eid', id)
    })
    return config.axiosInstance.delete(`jobplanning/${id}`, {
      params
    })
  },
  swapPlanningRequest (employeeIds, isDown, id) {
    const data = {
      employeeIds,
      isDown
    }
    return config.axiosInstance.put(`jobplanning/sequence/${id}`, data)
  }
}
