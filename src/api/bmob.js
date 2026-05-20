const APP_ID = '8eff05b11c17b546b31d8712a896a3f5'
const REST_API_KEY = 'b5a726fa9e336bb97ed13055d3fae348'
const MASTER_KEY = '671929bd443446882baec987a7c089bf'
const BASE_URL = 'https://api.codenow.cn/1'

function headers(sessionToken, useMaster) {
  const h = { 'X-Bmob-Application-Id': APP_ID, 'X-Bmob-REST-API-Key': REST_API_KEY, 'Content-Type': 'application/json' }
  if (useMaster) h['X-Bmob-Master-Key'] = MASTER_KEY
  if (sessionToken) h['X-Bmob-Session-Token'] = sessionToken
  return h
}

async function request(method, path, body, sessionToken, useMaster) {
  const opts = { method, headers: headers(sessionToken, useMaster) }
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

  updateUser(objectId, data, useMaster) {
    return request('PUT', `/users/${objectId}`, data, useMaster ? null : getToken(), useMaster!==false)
  },

  query(className, where) {
    const whereStr = where ? `?where=${encodeURIComponent(JSON.stringify(where))}` : ''
    return request('GET', `/classes/${className}${whereStr}`, null, getToken())
  },

  queryAll(className, where, useMaster) {
    const whereStr = where ? `?where=${encodeURIComponent(JSON.stringify(where))}` : ''
    const limit = 'limit=1000'
    const sep = whereStr ? '&' : '?'
    return request('GET', `/classes/${className}${whereStr}${sep}${limit}`, null, useMaster ? null : getToken(), useMaster)
  },

  create(className, data) {
    return request('POST', `/classes/${className}`, data, getToken())
  },

  update(className, objectId, data, sessionToken, useMaster) {
    return request('PUT', `/classes/${className}/${objectId}`, data, useMaster ? null : (sessionToken||getToken()), useMaster)
  },

  delete(className, objectId, useMaster) {
    return request('DELETE', `/classes/${className}/${objectId}`, null, useMaster ? null : getToken(), useMaster)
  }
}
