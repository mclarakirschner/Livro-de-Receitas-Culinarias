import { SUPABASE_URL, API_KEY } from './config.js'

// ===========================================
// LOGIN DO USUÁRIO
// ===========================================
export async function login(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()

  if (res.ok) {
    // ⚡ Salva o token e o ID do usuário logado
    localStorage.setItem('sb_token', data.access_token)
    localStorage.setItem('sb_user', JSON.stringify(data.user)) // 👈 Adiciona esta linha
    return true
  } else {
    throw new Error(data.msg || "Erro no login")
  }
}

// ===========================================
// VERIFICA AUTENTICAÇÃO
// ===========================================
export async function verificaAutenticacao() {
  const token = localStorage.getItem('sb_token')
  if (!token) {
    window.location.href = 'index.html'
    return false
  }
  return true
}

// ===========================================
// LOGOUT
// ===========================================
export function logout() {
  localStorage.removeItem('sb_token')
  window.location.href = 'index.html'
}

// ===========================================
// CRIAR NOVO USUÁRIO
// ===========================================
export async function signup(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()

  if (res.ok) {
    return true
  } else {
    throw new Error(data.msg || data.error_description || "Erro ao criar usuário")
  }
}
