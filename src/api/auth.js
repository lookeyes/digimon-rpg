import api from './bmob.js'

export async function register(username, password) {
  const result = await api.register(username, password)
  if (result.sessionToken) {
    api.saveToken(result.sessionToken)
    try {
      await api.updateUser(result.objectId, { gold: 10000 })
      result.gold = 10000
    } catch (e) {
      result.gold = 10000
    }
    localStorage.setItem('user', JSON.stringify(result))
  }
  return result
}

export async function login(username, password) {
  const result = await api.login(username, password)
  if (result.sessionToken) {
    api.saveToken(result.sessionToken)
    localStorage.setItem('user', JSON.stringify(result))
  }
  return result
}

export function logout() {
  api.clearToken()
}

export function getCurrentUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function isLoggedIn() {
  return !!api.getToken()
}
