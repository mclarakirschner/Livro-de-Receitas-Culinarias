import { SUPABASE_URL, API_KEY } from "./config.js";

//Buscar receitas
export async function buscarCategorias() {
  const token = localStorage.getItem('sb_token')
  const res = await fetch(`${SUPABASE_URL}/rest/v1/categorias?select=*&order=descricao.asc`, {
      headers: {
          "apikey": API_KEY,
          "Authorization": `Bearer ${token}`
      }
  })
  return res.json()
}