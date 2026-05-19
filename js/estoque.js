/* ===========================
   ALIANÇA — ESTOQUE
   =========================== */

/* ============================================================
   v3.0 — ESTOQUE + LOJA + IMPORTAÇÃO SMB
   ============================================================ */
var _produtosCache = [];   // lista em memória — carregada do Firebase
var _produtoEdit = null;   // produto sendo editado/incluído
var _produtoEntrada = null;

async function abrirEstoque() {
  document.getElementById('estoqueOverlay').classList.add('open');
  await _recarregarEstoque();
}
function fecharEstoque() { document.getElementById('estoqueOverlay').classList.remove('open'); }

async function _recarregarEstoque() {
  if (!window.carregarProdutos) {
    document.getElementById('estoqueBody').innerHTML = '<div style="padding:40px;text-align:center;color:#c00">⚠️ Firebase indisponível</div>';
    return;
  }
  document.getElementById('estoqueBody').innerHTML = '<div style="padding:40px;text-align:center;color:#888">Carregando produtos do Firebase...</div>';
  _produtosCache = await window.carregarProdutos();
  _popularFiltroGrupos('estoqueGrupo', _produtosCache);
  _renderEstoque();
  // também recarrega loja
  if (window._recarregarLoja) window._recarregarLoja(true);
}

function _popularFiltroGrupos(selectId, lista) {
  var sel = document.getElementById(selectId);
  if (!sel) return;
  var grupos = Array.from(new Set(lista.map(p => p.grupo).filter(Boolean))).sort();
  var atual = sel.value;
  sel.innerHTML = '<option value="">Todos os grupos</option>' + grupos.map(g => '<option value="'+g+'">'+g+' ('+lista.filter(p=>p.grupo===g).length+')</option>').join('');
  if (atual) sel.value = atual;
}

function _renderEstoque() {
  var busca = (document.getElementById('estoqueBusca').value || '').toLowerCase().trim();
  var grupo = document.getElementById('estoqueGrupo').value;
  var status = document.getElementById('estoqueStatus').value;
  var filtrados = _produtosCache.filter(p => {
    if (grupo && p.grupo !== grupo) return false;
    if (status === 'esgotado' && p.estoque > 0) return false;
    if (status === 'baixo' && !(p.estoque > 0 && p.estoque <= (p.estoqueMinimo || 0))) return false;
    if (status === 'positivo' && p.estoque <= 0) return false;
    if (busca) {
      var hay = (p.nome + ' ' + p.codigo + ' ' + (p.subgrupo||'') + ' ' + (p.grupo||'')).toLowerCase();
      if (!hay.includes(busca)) return false;
    }
    return true;
  });
  document.getElementById('estoqueCount').textContent = filtrados.length + ' / ' + _produtosCache.length + ' produtos';

  if (filtrados.length === 0) {
    document.getElementById('estoqueBody').innerHTML = '<div style="padding:40px;text-align:center;color:#888">💭 Nenhum produto encontrado com esses filtros</div>';
    return;
  }

  var rows = filtrados.map(p => {
    var estoque = Number(p.estoque || 0);
    var min = Number(p.estoqueMinimo || 0);
    var badgeColor = '#28a745', badgeText = String(estoque);
    if (estoque <= 0) { badgeColor = '#dc3545'; badgeText = estoque + ' ⚠️'; }
    else if (estoque <= min) { badgeColor = '#f59e0b'; badgeText = estoque + ' 🔽'; }
    var precoStr = 'R$ ' + (Number(p.preco)||0).toFixed(2).replace('.', ',');
    var codigoEsc = String(p.codigo).replace(/'/g, "\\'");
    return `<tr style="border-bottom:1px solid var(--color-border)">
      <td style="padding:8px 10px;font-family:monospace;font-size:11px;color:#666">${p.codigo}</td>
      <td style="padding:8px 10px;font-size:13px;font-weight:500">${p.nome}</td>
      <td style="padding:8px 10px;font-size:11px;color:#666">${p.grupo||''}<br><span style="color:#999">${p.subgrupo||''}</span></td>
      <td style="padding:8px 10px;font-size:13px;text-align:right;font-weight:600">${precoStr}</td>
      <td style="padding:8px 10px;text-align:center"><span style="background:${badgeColor};color:#fff;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;font-family:monospace">${badgeText}</span><br><span style="font-size:10px;color:#999">min: ${min} ${p.unid||'UN'}</span></td>
      <td style="padding:8px 10px;white-space:nowrap;text-align:right">
        <button onclick="_abrirEntradaEstoque('${codigoEsc}')" class="btn-ver" style="padding:5px 9px;font-size:11px;background:#28a745;color:#fff;border:none;margin-right:4px" title="Entrada de estoque">➕</button>
        <button onclick="_abrirEditarProduto('${codigoEsc}')" class="btn-ver" style="padding:5px 9px;font-size:11px;margin-right:4px" title="Editar">✏️</button>
      </td>
    </tr>`;
  }).join('');

  document.getElementById('estoqueBody').innerHTML = `
    <table style="width:100%;border-collapse:collapse;background:var(--color-card)">
      <thead style="position:sticky;top:0;background:var(--color-card);box-shadow:0 1px 0 var(--color-border)">
        <tr style="font-size:11px;color:#666;text-align:left;text-transform:uppercase">
          <th style="padding:10px">Código</th>
          <th style="padding:10px">Nome</th>
          <th style="padding:10px">Grupo / Subgrupo</th>
          <th style="padding:10px;text-align:right">Preço</th>
          <th style="padding:10px;text-align:center">Estoque</th>
          <th style="padding:10px;text-align:right">Ações</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* ---------- Entrada de Estoque ---------- */
function _abrirEntradaEstoque(codigo) {
  _produtoEntrada = _produtosCache.find(p => String(p.codigo) === String(codigo));
  if (!_produtoEntrada) return;
  document.getElementById('entradaProdNome').textContent = _produtoEntrada.nome;
  document.getElementById('entradaProdEstoque').textContent = _produtoEntrada.estoque + ' ' + (_produtoEntrada.unid||'UN');
  document.getElementById('entradaQty').value = 1;
  document.getElementById('entradaMotivo').value = '';
  document.getElementById('entradaEstoqueOverlay').classList.add('open');
}
function _fecharEntradaEstoque(){ document.getElementById('entradaEstoqueOverlay').classList.remove('open'); }
async function _confirmarEntradaEstoque() {
  if (!_produtoEntrada) return;
  var qty = parseInt(document.getElementById('entradaQty').value || '0', 10);
  var motivo = document.getElementById('entradaMotivo').value.trim() || 'Entrada manual';
  if (qty <= 0) { alert('Quantidade inválida'); return; }
  try {
    await window.entradaEstoque(_produtoEntrada.codigo, qty, motivo);
    _fecharEntradaEstoque();
    await _recarregarEstoque();
  } catch (e) { alert('Erro: ' + e.message); }
}

/* ---------- Editar / Criar Produto ---------- */
function _abrirEditarProduto(codigo) {
  var prod = codigo ? _produtosCache.find(p => String(p.codigo) === String(codigo)) : null;
  _produtoEdit = prod;
  document.getElementById('editarProdutoTitulo').textContent = prod ? '✏️ Editar Produto' : '➕ Novo Produto';
  document.getElementById('prodCodigo').value = prod ? prod.codigo : '';
  document.getElementById('prodCodigo').disabled = !!prod;
  document.getElementById('prodNome').value = prod ? prod.nome : '';
  document.getElementById('prodGrupo').value = prod ? prod.grupo : '';
  document.getElementById('prodSubgrupo').value = prod ? (prod.subgrupo||'') : '';
  document.getElementById('prodPreco').value = prod ? prod.preco : '';
  document.getElementById('prodUnid').value = prod ? (prod.unid||'UN') : 'UN';
  document.getElementById('prodEstoque').value = prod ? prod.estoque : 0;
  document.getElementById('prodEstoqueMin').value = prod ? (prod.estoqueMinimo||0) : 0;
  document.getElementById('prodEditMsg').textContent = '';
  document.getElementById('prodDeleteBtn').style.display = prod ? 'inline-block' : 'none';
  document.getElementById('editarProdutoOverlay').classList.add('open');
}
function _fecharEditarProduto(){ document.getElementById('editarProdutoOverlay').classList.remove('open'); }
async function _salvarProdutoUI() {
  var codigo = document.getElementById('prodCodigo').value.trim();
  var nome = document.getElementById('prodNome').value.trim();
  if (!codigo || !nome) { document.getElementById('prodEditMsg').textContent = '⚠️ Código e Nome são obrigatórios'; return; }
  var payload = {
    codigo: codigo,
    nome: nome,
    grupo: document.getElementById('prodGrupo').value.trim() || 'OUTROS',
    subgrupo: document.getElementById('prodSubgrupo').value.trim(),
    preco: parseFloat(document.getElementById('prodPreco').value) || 0,
    unid: document.getElementById('prodUnid').value.trim() || 'UN',
    estoque: parseInt(document.getElementById('prodEstoque').value) || 0,
    estoqueMinimo: parseInt(document.getElementById('prodEstoqueMin').value) || 0,
    ativo: true,
    origem: _produtoEdit ? _produtoEdit.origem : 'manual'
  };
  try {
    await window.salvarProduto(payload);
    _fecharEditarProduto();
    await _recarregarEstoque();
  } catch (e) { document.getElementById('prodEditMsg').textContent = '❌ ' + e.message; }
}
async function _excluirProdutoUI() {
  if (!_produtoEdit) return;
  if (!confirm('Excluir "' + _produtoEdit.nome + '" do estoque? (não pode desfazer)')) return;
  try {
    await window.deletarProduto(_produtoEdit.codigo);
    _fecharEditarProduto();
    await _recarregarEstoque();
  } catch (e) { document.getElementById('prodEditMsg').textContent = '❌ ' + e.message; }
}

/* ---------- Importar SMB (one-shot) ---------- */
async function _abrirImportSMB() {
  if (!confirm('Importar 414 produtos do SMB para o Firebase?\n\nProdutos existentes (mesmo código) serão atualizados (não duplica).\nIsso pode levar 5–10 segundos.')) return;
  var btn = event && event.target;
  if (btn) { btn.disabled = true; btn.textContent = 'Importando...'; }
  try {
    var resp = await fetch('produtos_smb.json?ts=' + Date.now());
    if (!resp.ok) throw new Error('produtos_smb.json não encontrado (status ' + resp.status + ')');
    var lista = await resp.json();
    if (!Array.isArray(lista) || lista.length === 0) throw new Error('JSON vazio ou inválido');
    var total = await window.importarProdutosEmLote(lista);
    alert('✓ ' + total + ' produtos importados com sucesso no Firebase!\nTodos os PCs agora veem o mesmo estoque.');
    await _recarregarEstoque();
  } catch (e) {
    alert('❌ Erro na importação: ' + e.message + '\n\nSe estiver rodando local, certifique-se que o arquivo produtos_smb.json está na mesma pasta.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '📥 Importar SMB'; }
  }
}

/* ============================================================
   LOJA — categoria visual na Central de Serviços
   ============================================================ */
var _lojaCache = [];

async function _recarregarLoja(silencioso) {
  if (!window.carregarProdutos) return;
  if (!silencioso) {
    var grid = document.getElementById('grid-loja');
    if (grid) grid.innerHTML = '<div style="padding:30px;text-align:center;color:#888;grid-column:1/-1">Carregando produtos...</div>';
  }
  _lojaCache = await window.carregarProdutos();
  // popular filtro grupos da loja
  _popularFiltroGrupos('lojaGrupo', _lojaCache);
  _renderLoja();
}
window._recarregarLoja = _recarregarLoja;

function _renderLoja() {
  var grid = document.getElementById('grid-loja');
  var count = document.getElementById('count-loja');
  if (!grid) return;
  var busca = ((document.getElementById('lojaBusca')||{}).value || '').toLowerCase().trim();
  var grupo = (document.getElementById('lojaGrupo')||{}).value || '';
  var soComEstoque = (document.getElementById('lojaSoComEstoque')||{}).checked;
  var filtrados = _lojaCache.filter(p => {
    if (p.ativo === false) return false;
    if (grupo && p.grupo !== grupo) return false;
    if (soComEstoque && (Number(p.estoque) <= 0)) return false;
    if (busca) {
      var hay = (p.nome + ' ' + p.codigo + ' ' + (p.subgrupo||'')).toLowerCase();
      if (!hay.includes(busca)) return false;
    }
    return true;
  });
  if (count) count.textContent = filtrados.length + ' produto(s)';

  if (filtrados.length === 0) {
    grid.innerHTML = '<div style="padding:30px;text-align:center;color:#888;grid-column:1/-1">💭 Nenhum produto encontrado. Tente importar do SMB no botão 📦 Estoque.</div>';
    return;
  }

  // Limita a 200 cards renderizados para não lagar (414 produtos)
  var renderizados = filtrados.slice(0, 200);
  grid.innerHTML = renderizados.map(p => {
    var est = Number(p.estoque) || 0;
    var min = Number(p.estoqueMinimo) || 0;
    var precoStr = 'R$ ' + (Number(p.preco)||0).toFixed(2).replace('.', ',');
    var nomeEsc = String(p.nome).replace(/'/g,"\\'").replace(/"/g,'&quot;');
    var codigoEsc = String(p.codigo).replace(/'/g,"\\'");
    var badge = '';
    if (est <= 0) badge = '<span style="position:absolute;top:8px;right:8px;background:#dc3545;color:#fff;padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;letter-spacing:.5px">ESGOTADO</span>';
    else if (est <= min) badge = '<span style="position:absolute;top:8px;right:8px;background:#f59e0b;color:#fff;padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700">BAIXO</span>';
    var estColor = est > min ? '#28a745' : (est > 0 ? '#f59e0b' : '#dc3545');
    return `<div class="card" data-name="${(p.nome||'').toLowerCase()}" data-cat="loja" style="position:relative;border-left:3px solid #5a3e8a">
      ${badge}
      <div class="card-top">
        <div class="card-name" style="padding-right:60px">${p.nome}</div>
        <span class="card-price" style="background:#5a3e8a;color:#fff">${precoStr}</span>
      </div>
      <div class="card-obs" style="font-size:11px">
        📂 ${p.grupo||''} ${p.subgrupo ? '· ' + p.subgrupo : ''}<br>
        📊 Estoque: <b style="color:${estColor}">${est} ${p.unid||'UN'}</b> ${min ? '(mín: '+min+')' : ''}<br>
        🏷️ Código: <span style="font-family:monospace;font-size:10px">${p.codigo}</span>
      </div>
      <div style="display:flex;gap:6px">
        <button class="btn-ver" onclick="_abrirEditarProduto('${codigoEsc}')" style="flex:1" title="Editar produto">✏️</button>
        <button class="btn-add-cart" onclick="addProductToCart('${codigoEsc}','${nomeEsc}',${p.preco||0})" style="flex:2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          + Caixa
        </button>
      </div>
    </div>`;
  }).join('');

  if (filtrados.length > 200) {
    grid.innerHTML += '<div style="grid-column:1/-1;text-align:center;color:#888;padding:14px;font-size:12px">Mostrando primeiros 200 de ' + filtrados.length + '. Use a busca pra filtrar.</div>';
  }
}
window._renderLoja = _renderLoja;

/* Carrega loja em background ao abrir o site */
window.addEventListener('load', function(){
  setTimeout(function(){
    if (window.carregarProdutos) {
      _recarregarLoja();
    }
  }, 2500);
});

/* Expor */
window.abrirEstoque = abrirEstoque;
window.fecharEstoque = fecharEstoque;
window._recarregarEstoque = _recarregarEstoque;
window._renderEstoque = _renderEstoque;
window._abrirEntradaEstoque = _abrirEntradaEstoque;
window._fecharEntradaEstoque = _fecharEntradaEstoque;
window._confirmarEntradaEstoque = _confirmarEntradaEstoque;
window._abrirEditarProduto = _abrirEditarProduto;
window._fecharEditarProduto = _fecharEditarProduto;
window._salvarProdutoUI = _salvarProdutoUI;
window._excluirProdutoUI = _excluirProdutoUI;
window._abrirImportSMB = _abrirImportSMB;

/* ---------- Limpar todos os produtos (perigoso) ---------- */
async function _limparTodosProdutos() {
  if (typeof window.carregarProdutos !== 'function' || typeof window.deletarProduto !== 'function') { alert('Firebase não conectado.'); return; }
  const confirma1 = confirm('⚠️ APAGAR TODOS OS PRODUTOS do Firebase?\n\nIsso apaga a collection "produtos" inteira. Não tem como desfazer.\n\nContinuar?');
  if (!confirma1) return;
  const confirma2 = prompt('Pra confirmar, digite APAGAR (em maiúsculo):');
  if (confirma2 !== 'APAGAR') { alert('Cancelado.'); return; }
  const btn = event && event.target;
  if (btn) { btn.disabled = true; btn.textContent = 'Apagando...'; }
  try {
    const produtos = await window.carregarProdutos();
    if (!produtos || produtos.length === 0) { alert('Já estava vazio.'); return; }
    let apagados = 0;
    for (const p of produtos) {
      try { await window.deletarProduto(p.codigo); apagados++; } catch(e){ console.warn('falha ao apagar', p.codigo, e); }
      if (btn) btn.textContent = `Apagando ${apagados}/${produtos.length}...`;
    }
    alert(`✅ ${apagados} produtos apagados do Firebase.\n\nAgora clique em 📥 Importar SMB pra subir a base nova.`);
    if (typeof _recarregarEstoque === 'function') _recarregarEstoque();
    if (typeof _renderLoja === 'function') _renderLoja();
  } catch(err) {
    console.error(err);
    alert('Erro ao limpar: ' + err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '🗑️ Limpar tudo'; }
  }
}
window._limparTodosProdutos = _limparTodosProdutos;

/* ESC fecha overlays do estoque */
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    var ov = document.getElementById('estoqueOverlay');
    if (ov && ov.classList.contains('open')) fecharEstoque();
    var ov2 = document.getElementById('entradaEstoqueOverlay');
    if (ov2 && ov2.classList.contains('open')) _fecharEntradaEstoque();
    var ov3 = document.getElementById('editarProdutoOverlay');
    if (ov3 && ov3.classList.contains('open')) _fecharEditarProduto();
  }
});
