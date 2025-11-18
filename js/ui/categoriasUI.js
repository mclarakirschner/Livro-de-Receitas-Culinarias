import { buscarCategorias } from "../modules/categorias.js";

export async function carregarCategorias(){
    const dados = await buscarCategorias()
    const tbody = document.getElementById('tabelaCategorias')
    tbody.innerHTML = '' // limpa o conteúdo
    dados.forEach(categoria => {
        // cria a linha com tr
        const tr = document.createElement('tr')
        tr.className = "bg-yellow-100 hover:bg-amber-200";

        tr.innerHTML = `
        <td class='border border-amber-400 p-2'>${categoria.descricao}</td>`
        tbody.appendChild(tr)
    })
}