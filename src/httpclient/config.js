import axios from 'axios'
import { MessageBox } from 'element-ui'
import Store from '../store'
import AuthService from '../auth/authService.js'

const axiosInstance = axios.create({
  baseURL: window.baseAPIURL,
  timeout: 90000
})

// Request interceptor, mainly used for authorization
axiosInstance.interceptors.request.use(async (config) => {
  // Get the access token
  const token = await AuthService.getAccessToken()
  config.headers.common.Authorization = `Bearer ${token}`
  return config
}, error => Promise.reject(error)
)

// Response interceptor, which we can use to handle error codes when making a request
axiosInstance.interceptors.response.use(
  response => response,
  (error) => {
    // No response from server, so either the server is
    // down or their internet is off --> Network error
    if (!error.response) {
      // We custom build the object because it is undefineds
      error.response = {
        status: 503,
        config: null,
        data: null,
        headers: null,
        request: XMLHttpRequest,
        statusText: 'Network Error'
      }
    }

    // Commit error to store
    Store.commit({
      type: 'addApiError',
      error: error.response
    })

    // We did receive a response from the server
    switch (error.response.status) {
      // Unauthorized, either his token expired or he does not have on.
      case 401:
        MessageBox({
          title: 'Not authorized',
          message: 'We could not authorize you, reload or login again',
          type: 'warning'
        })
        // We clear the storage so that the authorize request can be executed the next time the page reloads
        localStorage.removeItem('access_token')
        break
      // Bad request, either a model error or an error we want the user to see
      case 400:
        // Some model error
        if (error.response.data.modelError) {
          MessageBox({
            title: 'Error occurred',
            message: 'There were either outstanding required data or the data was not in the correct format.',
            type: 'warning'
          })
          // User error
        } else if (error.response.data.userError) {
          MessageBox({
            title: 'Error occurred',
            message: error.response.data.userError.message,
            type: 'warning'
          })
          // blob error, meaning the report could not be generated
        } else if (error.response.config.responseType === 'blob') {
          MessageBox({
            title: 'Error occurred',
            message: 'Error while generating report, please try again',
            type: 'error'
          })
          // Just to be sure, but we should never even get here
        } else {
          MessageBox({
            title: 'Unexpected error occurred',
            message: 'We are not sure what just happened :( Please try again. Sorry for the inconvenience',
            type: 'error'
          })
        }
        break
      // Forbidden, user does not have the required rights to view a page
      case 403:
        MessageBox({
          title: 'Forbidden 403',
          message: 'Sorry, you are not allowed to view this.',
          type: 'error'
        })
        break
      // Backend-controller action was not found.
      case 404:
        MessageBox({
          title: 'Not found 404',
          message: 'Sorry, the resource was not found on the server.',
          type: 'error'
        })
        break
      // Internal server error
      case 500:
        MessageBox({
          title: 'Error occurred',
          message: 'An error occurred on the server. Please try again. Sorry for the inconvenience',
          type: 'error'
        })
        break
      // Network related error
      case 503:
        MessageBox({
          title: 'Network Error 503',
          message: 'Sorry, the server is unavailable.',
          type: 'error'
        })
        break
      // Unexpected error code
      default:
        MessageBox({
          title: 'Unexpected error occurred',
          message: 'We are not sure what just happened :( Please try again. Sorry for the inconvenience',
          type: 'error'
        })
        break
    }

    return Promise.reject(error)
  })

export default {
  axiosInstance
}
