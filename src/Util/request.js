import axios from 'axios'

const service = axios.create({
  baseURL: '/api',  
  timeout: 5000
})

// 请求拦截器，统一附加 token
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['token'] = token  // 后端拦截器中读取的是这个字段
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default service