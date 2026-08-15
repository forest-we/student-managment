import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:4300/api',
  timeout: 5000,
})
//请求拦截器
request.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
export default request
