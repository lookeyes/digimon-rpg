<template>
  <div class="auth-page">
    <div class="logo">
      <h1>数码宝贝RPG</h1>
      <div class="sub">创建账号</div>
    </div>

    <div class="card">
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

      <div class="input-group">
        <label>用户名</label>
        <input v-model="username" type="text" placeholder="请输入用户名" autocomplete="username" />
      </div>

      <div class="input-group">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码（至少6位）" autocomplete="new-password" />
      </div>

      <div class="input-group">
        <label>确认密码</label>
        <input v-model="password2" type="password" placeholder="请再次输入密码" autocomplete="new-password" />
      </div>

      <button class="btn btn-primary" @click="handleRegister" :disabled="loading">
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <div class="auth-link">
        已有账号？<router-link to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/auth.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const password2 = ref('')
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

async function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!username.value.trim()) {
    errorMsg.value = '请输入用户名'
    return
  }
  if (username.value.trim().length < 2) {
    errorMsg.value = '用户名至少2个字符'
    return
  }
  if (!password.value) {
    errorMsg.value = '请输入密码'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = '密码至少6位'
    return
  }
  if (password.value !== password2.value) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  try {
    await register(username.value.trim(), password.value)
    successMsg.value = '注册成功！正在跳转...'
    setTimeout(() => router.push('/home'), 500)
  } catch (e) {
    errorMsg.value = e.message || '注册失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>
