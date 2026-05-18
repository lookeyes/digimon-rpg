const APP_ID = '8eff05b11c17b546b31d8712a896a3f5'
const REST_API_KEY = 'b5a726fa9e336bb97ed13055d3fae348'
const BASE_URL = 'https://api.codenow.cn/1'

function headers(sessionToken) {
  const h = {
    'X-Bmob-Application-Id': APP_ID,
    'X-Bmob-REST-API-Key': REST_API_KEY,
    'Content-Type': 'application/json'
  }
  if (sessionToken) {
    h['X-Bmob-Session-Token'] = sessionToken
  }
  return h
}

async function request(method, path, body, sessionToken) {
  const opts = {
    method,
    headers: headers(sessionToken)
  }
  if (body) {
    opts.body = JSON.stringify(body)
  }
  const res = await fetch(`${BASE_URL}${path}`, opts)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || '请求失败')
  }
  return data
}

function getToken() {
  return localStorage.getItem('sessionToken')
}

function saveToken(token) {
  localStorage.setItem('sessionToken', token)
}

function clearToken() {
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('user')
}

export default {
  getToken,
  saveToken,
  clearToken,

  register(username, password) {
    return request('POST', '/users', { username, password })
  },

  login(username, password) {
    return request('GET', `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
  },

  getUser(objectId) {
    return request('GET', `/users/${objectId}`, null, getToken())
  },

  updateUser(objectId, data) {
    return request('PUT', `/users/${objectId}`, data, getToken())
  },

  query(className, where) {
    const whereStr = where ? `?where=${encodeURIComponent(JSON.stringify(where))}` : ''
    return request('GET', `/classes/${className}${whereStr}`, null, getToken())
  },

  create(className, data) {
    return request('POST', `/classes/${className}`, data, getToken())
  },

  update(className, objectId, data) {
    return request('PUT', `/classes/${className}/${objectId}`, data, getToken())
  },

  delete(className, objectId) {
    return request('DELETE', `/classes/${className}/${objectId}`, null, getToken())
  }
}
