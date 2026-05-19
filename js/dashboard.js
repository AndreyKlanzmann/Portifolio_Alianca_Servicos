/* ===========================
   ALIANÇA — DASHBOARD
   =========================== */

/* ============================================================
   DASHBOARD + TELEGRAM — Aliança v2.6
   ============================================================ */

const TG_KEY = 'alianca_tg_config_v1';
const TG_SENT_KEY = 'alianca_tg_sent_log_v1';
const LEMBRETE_KEY = 'alianca_lembrete_config_v1';
const BANNER_DISMISS_KEY = 'alianca_banner_dismiss_v1';
let _dashChartLinha = null, _dashChartTop = null;
let _dashPeriodo = 'today';
let _dashData = [];
let _diasEmAberto = []; // [{data, totalFat, totalAt}]

/* ---------- Telegram config ---------- */
function _tgGet() {
  try { return JSON.parse(localStorage.getItem(TG_KEY) || 'null'); } catch (e) { return null; }
}
function _tgSet(cfg) { localStorage.setItem(TG_KEY, JSON.stringify(cfg)); _tgUpdateBadge(); }
function _tgUpdateBadge() {
  const el = document.getElementById('tgStatus');
  if (!el) return;
  const cfg = _tgGet();
  if (cfg && cfg.token && cfg.chatId) {
    el.textContent = 'Telegram: ativo';
    el.className = 'notify-status ok';
  } else {
    el.textContent = 'Telegram: desconfigurado';
    el.className = 'notify-status off';
  }
}
function abrirConfigTelegram() {
  const cfg = _tgGet() || {};
  document.getElementById('tgInputToken').value = cfg.token || '';
  document.getElementById('tgInputChatId').value = cfg.chatId || '';
  document.getElementById('tgConfigMsg').textContent = '';
  document.getElementById('tgConfigOverlay').classList.add('open');
}
function fecharConfigTelegram() {
  document.getElementById('tgConfigOverlay').classList.remove('open');
}
function _tgSave() {
  const token = document.getElementById('tgInputToken').value.trim();
  const chatId = document.getElementById('tgInputChatId').value.trim();
  const msg = document.getElementById('tgConfigMsg');
  if (!token || !chatId) {
    msg.textContent = '⚠️ Preencha os dois campos'; msg.style.color = '#dc3545'; return;
  }
  _tgSet({ token, chatId });
  msg.textContent = '✓ Salvo'; msg.style.color = '#28a745';
}
function _tgClear() {
  if (!confirm('Remover configuração do Telegram?')) return;
  localStorage.removeItem(TG_KEY); _tgUpdateBadge();
  document.getElementById('tgInputToken').value = '';
  document.getElementById('tgInputChatId').value = '';
  const msg = document.getElementById('tgConfigMsg');
  msg.textContent = 'Configuração removida'; msg.style.color = '#888';
}
async function _tgTest() {
  const token = document.getElementById('tgInputToken').value.trim();
  const chatId = document.getElementById('tgInputChatId').value.trim();
  const msg = document.getElementById('tgConfigMsg');
  if (!token || !chatId) {
    msg.textContent = '⚠️ Preencha os dois campos antes de testar'; msg.style.color = '#dc3545'; return;
  }
  msg.textContent = 'Enviando teste...'; msg.style.color = '#666';
  try {
    const r = await _tgSend('🧪 *Teste Aliança Informática*\n\nSe você está vendo isso, a configuração está perfeita.', { token, chatId });
    if (r.ok) { msg.textContent = '✓ Mensagem enviada! Confere seu Telegram'; msg.style.color = '#28a745'; }
    else { msg.textContent = '❌ Erro: ' + (r.description || 'verifique TOKEN/CHAT ID e mande "oi" pro bot primeiro'); msg.style.color = '#dc3545'; }
  } catch (e) {
    msg.textContent = '❌ Falha de rede: ' + e.message; msg.style.color = '#dc3545';
  }
}
async function _tgSend(texto, cfgOverride) {
  const cfg = cfgOverride || _tgGet();
  if (!cfg || !cfg.token || !cfg.chatId) throw new Error('Telegram não configurado');
  const url = `https://api.telegram.org/bot${cfg.token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: cfg.chatId, text: texto, parse_mode: 'Markdown' })
  });
  return res.json();
}

/* ---------- Datas helpers ---------- */
function _hojeISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function _isoMinusDias(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function _ddmm(iso) {
  if (!iso) return '';
  const p = iso.split('-'); return p[2] + '/' + p[1];
}
function _brl(n) {
  return 'R$ ' + (n||0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.').replace(/^R\$ (.*)\.(\d{2})$/, (_,a,b)=>'R$ '+a+','+b);
}
function _brlSimples(n) {
  return 'R$ ' + (n||0).toFixed(2).replace('.', ',');
}

/* ---------- Dashboard ---------- */
async function abrirDashboard() {
  document.getElementById('dashOverlay').classList.add('open');
  _tgUpdateBadge();
  await _dashCarregar();
}
function fecharDashboard() {
  document.getElementById('dashOverlay').classList.remove('open');
  if (_dashChartLinha) { _dashChartLinha.destroy(); _dashChartLinha = null; }
  if (_dashChartTop)   { _dashChartTop.destroy();   _dashChartTop = null; }
}
function _dashSet(p) {
  _dashPeriodo = p;
  document.querySelectorAll('.dash-period-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.period === p);
  });
  _dashCarregar();
}
function _dashPeriodoRange() {
  if (_dashPeriodo === 'today') return [_hojeISO(), _hojeISO()];
  if (_dashPeriodo === '7')     return [_isoMinusDias(6), _hojeISO()];
  if (_dashPeriodo === '30')    return [_isoMinusDias(29), _hojeISO()];
  if (_dashPeriodo === 'month') {
    const d = new Date();
    const ini = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-01';
    return [ini, _hojeISO()];
  }
  return [_hojeISO(), _hojeISO()];
}
async function _dashCarregar() {
  const body = document.getElementById('dashBody');
  body.innerHTML = '<div class="dash-empty">Carregando dados...</div>';
  const [di, df] = _dashPeriodoRange();
  document.getElementById('dashPeriodInfo').textContent = _ddmm(di) + ' até ' + _ddmm(df);
  if (!window.carregarAtendimentosPorPeriodo) {
    // Firebase não configurado — usar dados locais da sessão
    const local = (typeof _atendimentos !== 'undefined' ? _atendimentos : [])
      .filter(a => a.data >= di && a.data <= df);
    if (local.length === 0) {
      body.innerHTML = '<div class="dash-empty" style="padding:32px 20px">' +
        '<div style="font-size:32px;margin-bottom:12px">📊</div>' +
        '<div style="font-size:15px;font-weight:600;margin-bottom:8px">Nenhum atendimento ainda</div>' +
        '<div style="font-size:13px;color:var(--color-text-muted);margin-bottom:16px">Registre algumas vendas pelo carrinho e volte aqui para ver o dashboard.</div>' +
        '<div style="background:var(--color-surface-offset);border:1px solid var(--color-border);border-radius:10px;padding:12px 16px;font-size:12px;color:var(--color-text-muted);text-align:left;max-width:380px;margin:0 auto">' +
        '💡 <strong>Modo demonstração</strong> — dados ficam na sessão atual.<br>' +
        'Configure o <code>firebase.js</code> para persistência permanente entre dispositivos.' +
        '</div>' +
        '</div>';
      return;
    }
    _dashData = local;
    _dashRender();
    // Mostrar aviso de modo demo
    const aviso = document.createElement('div');
    aviso.style.cssText = 'margin:8px 24px 0;padding:8px 12px;background:rgba(1,105,111,.08);border:1px dashed #01696f;border-radius:8px;font-size:12px;color:#01696f';
    aviso.innerHTML = '💡 <strong>Modo demonstração</strong> — dados desta sessão. Configure o <code>firebase.js</code> para persistência permanente.';
    document.getElementById('dashBody').prepend(aviso);
    return;
  }
  try {
    _dashData = await window.carregarAtendimentosPorPeriodo(di, df);
    _dashRender();
  } catch (e) {
    body.innerHTML = '<div class="dash-empty">❌ Erro ao buscar dados: ' + e.message + '</div>';
  }
}
function _dashAgregar(data) {
  let totFat = 0, totAt = data.length, totItens = 0;
  const porDia = {}, porServico = {};
  data.forEach(a => {
    totFat += a.total || 0;
    (a.items || []).forEach(it => {
      totItens += it.qty || 0;
      const nome = it.name || '?';
      porServico[nome] = porServico[nome] || { qtd: 0, rec: 0 };
      porServico[nome].qtd += it.qty || 0;
      porServico[nome].rec += it.tot || 0;
    });
    const d = a.data || '?';
    porDia[d] = porDia[d] || { fat: 0, at: 0 };
    porDia[d].fat += a.total || 0;
    porDia[d].at += 1;
  });
  const ticket = totAt > 0 ? totFat / totAt : 0;
  const dias = Object.keys(porDia).sort();
  const servicosArr = Object.entries(porServico)
    .map(([nome, v]) => ({ nome, qtd: v.qtd, rec: v.rec, pct: totFat > 0 ? v.rec/totFat : 0 }))
    .sort((a,b) => b.rec - a.rec);
  return { totFat, totAt, totItens, ticket, porDia, dias, servicosArr };
}
function _dashRender() {
  const body = document.getElementById('dashBody');
  if (_dashData.length === 0) {
    body.innerHTML = '<div class="dash-empty">📭 Sem atendimentos nesse período</div>'; return;
  }
  const ag = _dashAgregar(_dashData);
  const top5 = ag.servicosArr.slice(0, 5);
  body.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi-card teal"><div class="kpi-label">Faturamento</div><div class="kpi-value">${_brl(ag.totFat)}</div><div class="kpi-sub">no período</div></div>
      <div class="kpi-card purple"><div class="kpi-label">Atendimentos</div><div class="kpi-value">${ag.totAt}</div><div class="kpi-sub">${ag.dias.length} dia(s)</div></div>
      <div class="kpi-card green"><div class="kpi-label">Ticket Médio</div><div class="kpi-value">${_brl(ag.ticket)}</div><div class="kpi-sub">por atendimento</div></div>
      <div class="kpi-card terra"><div class="kpi-label">Itens Vendidos</div><div class="kpi-value">${ag.totItens}</div><div class="kpi-sub">soma de qtds</div></div>
    </div>
    <div class="chart-grid">
      <div class="chart-box"><h3>Faturamento por Dia</h3><canvas id="dashCanvasLinha"></canvas></div>
      <div class="chart-box"><h3>Top 5 Serviços</h3><ul class="top-list">
        ${top5.map(s => `<li><span class="name">${s.nome}</span><span><span class="val">${_brl(s.rec)}</span><span class="pct">${(s.pct*100).toFixed(1)}%</span></span></li>`).join('')}
      </ul></div>
    </div>
    <div class="chart-box"><h3>Receita por Serviço (top 8)</h3><canvas id="dashCanvasTop"></canvas></div>
  `;
  // gráficos
  if (_dashChartLinha) _dashChartLinha.destroy();
  if (_dashChartTop) _dashChartTop.destroy();
  const ctxL = document.getElementById('dashCanvasLinha').getContext('2d');
  _dashChartLinha = new Chart(ctxL, {
    type: 'line',
    data: {
      labels: ag.dias.map(_ddmm),
      datasets: [{ label: 'Faturamento', data: ag.dias.map(d => ag.porDia[d].fat),
        borderColor: '#01696F', backgroundColor: 'rgba(1,105,111,.12)', tension: .25, fill: true, pointRadius: 4, pointBackgroundColor: '#01696F' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { callback: v => 'R$ ' + v } } } }
  });
  const top8 = ag.servicosArr.slice(0, 8);
  const ctxT = document.getElementById('dashCanvasTop').getContext('2d');
  _dashChartTop = new Chart(ctxT, {
    type: 'bar',
    data: {
      labels: top8.map(s => s.nome.length > 28 ? s.nome.slice(0,28)+'…' : s.nome),
      datasets: [{ label: 'Receita', data: top8.map(s => s.rec), backgroundColor: '#5a3e8a', borderRadius: 4 }]
    },
    options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { callback: v => 'R$ ' + v } } } }
  });
}

/* ---------- Geração de resumo texto p/ Telegram ---------- */
function _gerarResumoTexto(titulo, di, df, data) {
  if (!data || data.length === 0) {
    return `📊 *${titulo}*\n📅 ${_ddmm(di)} a ${_ddmm(df)}\n\n_Sem atendimentos no período_`;
  }
  const ag = _dashAgregar(data);
  const top3 = ag.servicosArr.slice(0, 3);
  let txt = `📊 *${titulo}*\n`;
  txt += `📅 ${_ddmm(di)}` + (di !== df ? ` a ${_ddmm(df)}` : '') + `\n`;
  txt += `━━━━━━━━━━━━━━━━━━\n\n`;
  txt += `💰 *Faturamento:* ${_brlSimples(ag.totFat)}\n`;
  txt += `🎯 *Atendimentos:* ${ag.totAt}\n`;
  txt += `📈 *Ticket Médio:* ${_brlSimples(ag.ticket)}\n`;
  txt += `📦 *Itens vendidos:* ${ag.totItens}\n\n`;
  if (top3.length) {
    txt += `*🏆 Top 3 Serviços:*\n`;
    top3.forEach((s, i) => {
      const med = ['🥇','🥈','🥉'][i];
      txt += `${med} ${s.nome} — ${_brlSimples(s.rec)} (${s.qtd}x)\n`;
    });
  }
  if (ag.dias.length > 1) {
    const melhor = ag.dias.reduce((m, d) => ag.porDia[d].fat > ag.porDia[m].fat ? d : m, ag.dias[0]);
    txt += `\n📅 Melhor dia: *${_ddmm(melhor)}* (${_brlSimples(ag.porDia[melhor].fat)})`;
  }
  txt += `\n\n_Aliança Informática · PDV v3.0_`;
  return txt;
}

async function enviarResumoManual(tipo) {
  if (!_tgGet()) {
    if (confirm('Telegram não configurado. Configurar agora?')) abrirConfigTelegram();
    return;
  }
  if (!window.carregarAtendimentosPorPeriodo) {
    alert('Firebase indisponível'); return;
  }
  let di, df, titulo;
  if (tipo === 'day') { di = df = _hojeISO(); titulo = 'Resumo do Dia'; }
  else if (tipo === 'week') { di = _isoMinusDias(6); df = _hojeISO(); titulo = 'Resumo Semanal'; }
  else { di = _isoMinusDias(29); df = _hojeISO(); titulo = 'Resumo Mensal'; }
  try {
    const data = await window.carregarAtendimentosPorPeriodo(di, df);
    const txt = _gerarResumoTexto(titulo, di, df, data);
    const r = await _tgSend(txt);
    if (r.ok) alert('✓ Resumo enviado no Telegram'); else alert('❌ Erro: ' + (r.description || 'verifique config'));
  } catch (e) { alert('❌ Falha: ' + e.message); }
}

/* ---------- Fechar caixa do dia (botão inteligente) ---------- */
// Substituído pela versão inteligente: abre overlay e detecta dias em aberto
async function fecharCaixaDoDia() {
  abrirFecharCaixaAvancado();
}

/* ---------- Fechamento avançado: detecta múltiplos dias ---------- */
async function abrirFecharCaixaAvancado() {
  document.getElementById('fecharCaixaOverlay').classList.add('open');
  document.getElementById('btnConfirmarFechamento').disabled = true;
  const body = document.getElementById('fecharCaixaBody');
  body.innerHTML = '<div class="dash-empty">Verificando dias em aberto...</div>';

  if (!window.carregarAtendimentosPorPeriodo) {
    body.innerHTML = '<div class="dash-empty">⚠️ Firebase indisponível</div>'; return;
  }

  try {
    // Busca últimos 14 dias para detectar pendências
    const fim = _hojeISO();
    const ini = _isoMinusDias(13);
    const data = await window.carregarAtendimentosPorPeriodo(ini, fim);
    const porDia = {};
    data.forEach(a => {
      const d = a.data || '?';
      porDia[d] = porDia[d] || { fat: 0, at: 0 };
      porDia[d].fat += a.total || 0;
      porDia[d].at += 1;
    });

    const hoje = _hojeISO();
    const log = _getSentLog();
    // v3.0: combina local + Firebase cache
    const cacheFB = JSON.parse(localStorage.getItem('alianca_caixa_fb_cache_v1') || '{"dias":[]}');
    const diasFechados = Array.from(new Set([...(log.day || []), ...cacheFB.dias]));

    // Lista todos os dias com atendimentos
    const dias = Object.keys(porDia).sort().reverse(); // mais recente primeiro
    const opcoes = dias.map(d => ({
      data: d,
      fat: porDia[d].fat,
      at: porDia[d].at,
      fechado: diasFechados.includes(d),
      hoje: d === hoje
    }));

    _diasEmAberto = opcoes;

    if (opcoes.length === 0) {
      body.innerHTML = '<div class="dash-empty">📭 Nenhum atendimento nos últimos 14 dias.</div>';
      return;
    }

    const emAberto = opcoes.filter(o => !o.fechado);
    const atrasados = emAberto.filter(o => !o.hoje);

    let html = '';
    if (atrasados.length > 0) {
      html += `<div style="background:#fff3cd;border:1px solid #ffe69c;color:#664d03;padding:10px 12px;border-radius:8px;font-size:13px;margin-bottom:16px">
        ⚠️ Você tem <b>${atrasados.length} dia(s) atrasado(s)</b> que ainda não foram fechados.
      </div>`;
    }
    html += '<div style="font-size:12px;font-weight:700;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Selecione os dias para fechar:</div>';
    html += '<div style="display:flex;flex-direction:column;gap:6px;max-height:340px;overflow-y:auto">';
    opcoes.forEach(o => {
      const labelData = _ddmmaaaa(o.data);
      const diaSem = _diaDaSemana(o.data);
      const bg = o.fechado ? '#f5f5f5' : (o.hoje ? '#e8f4f5' : '#fff8e1');
      const checked = (!o.fechado) ? 'checked' : '';
      const disabled = o.fechado ? 'disabled' : '';
      const dataEsc = o.data;
      const tag = o.fechado
        ? `<span style="display:flex;align-items:center;gap:6px"><span style="font-size:10px;background:#28a745;color:#fff;padding:2px 8px;border-radius:10px;font-weight:700">FECHADO</span><button onclick="event.preventDefault();event.stopPropagation();_reimprimir('${dataEsc}')" style="font-size:10px;padding:2px 8px;border-radius:10px;border:1.5px solid #28a745;background:none;color:#28a745;cursor:pointer;font-weight:700">🖨️</button></span>`
        : (o.hoje ? '<span style="font-size:10px;background:#01696F;color:#fff;padding:2px 8px;border-radius:10px;font-weight:700">HOJE</span>'
                  : '<span style="font-size:10px;background:#dc3545;color:#fff;padding:2px 8px;border-radius:10px;font-weight:700">ABERTO</span>');
      html += `<label style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:${bg};border:1px solid var(--color-border);border-radius:8px;cursor:${o.fechado?'not-allowed':'pointer'};font-size:13px">
        <input type="checkbox" class="fec-dia" data-dia="${o.data}" ${checked} ${disabled} onchange="_atualizarBtnFechar()">
        <div style="flex:1">
          <div style="font-weight:700;color:var(--color-text)">${labelData} <span style="font-weight:400;color:var(--color-text-muted);font-size:11px">· ${diaSem}</span></div>
          <div style="font-size:11px;color:var(--color-text-muted);margin-top:2px">${o.at} atendimento(s) · ${_brlSimples(o.fat)}</div>
        </div>
        ${tag}
      </label>`;
    });
    html += '</div>';
    body.innerHTML = html;
    _atualizarBtnFechar();
  } catch (e) {
    body.innerHTML = '<div class="dash-empty">❌ Erro: ' + e.message + '</div>';
  }
}

function _atualizarBtnFechar() {
  const checks = document.querySelectorAll('.fec-dia:checked');
  const btn = document.getElementById('btnConfirmarFechamento');
  btn.disabled = checks.length === 0;
  btn.textContent = checks.length > 0 ? `🔒 Fechar ${checks.length} dia(s)` : '🔒 Confirmar Fechamento';
}

function fecharFecharCaixaOverlay() {
  document.getElementById('fecharCaixaOverlay').classList.remove('open');
}

async function _executarFechamento() {
  const checks = document.querySelectorAll('.fec-dia:checked');
  if (checks.length === 0) return;
  const diasParaFechar = Array.from(checks).map(c => c.dataset.dia);
  const btn = document.getElementById('btnConfirmarFechamento');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  let sucesso = 0, falhas = 0, semTelegram = 0;
  const temTg = !!_tgGet();

  for (const dia of diasParaFechar) {
    try {
      const data = await window.carregarAtendimentosPorPeriodo(dia, dia);
      if (data.length === 0) { _marcarEnviado('day', dia); sucesso++; continue; }
      if (temTg) {
        const titulo = (dia === _hojeISO()) ? '🔒 Fechamento de Caixa' : `🔒 Fechamento de Caixa (atrasado)`;
        const txt = _gerarResumoTexto(titulo, dia, dia, data);
        const r = await _tgSend(txt);
        if (r.ok) { _marcarEnviado('day', dia); sucesso++; }
        else { falhas++; console.error('Falha Telegram dia', dia, r); }
      } else {
        _marcarEnviado('day', dia); semTelegram++;
      }
    } catch (e) { falhas++; console.error('Erro fechar dia', dia, e); }
  }

  // Capturar moeda e recolhido
  const _moeda = parseFloat((document.getElementById('caixaMoeda')?.value || '0').replace(',','.')) || 0;
  const _recolhido = parseFloat((document.getElementById('caixaRecolhido')?.value || '0').replace(',','.')) || 0;

  // Salvar moeda/recolhido no Firebase para cada dia fechado
  if (sucesso > 0 && window.fecharCaixaFirebase) {
    for (const dia of diasParaFechar) {
      try {
        await window.fecharCaixaFirebase(dia, { moeda: _moeda, recolhido: _recolhido });
      } catch(e) { console.warn('Erro ao salvar moeda/recolhido:', e); }
    }
  }

  let msg = '';
  if (sucesso > 0) msg += `✓ ${sucesso} dia(s) fechado(s)`;
  if (semTelegram > 0) msg += `\nℹ️ ${semTelegram} dia(s) marcado(s) como fechado(s) (Telegram não configurado, sem envio)`;
  if (falhas > 0) msg += `\n❌ ${falhas} dia(s) falharam`;
  alert(msg || 'Nada foi feito');

  fecharFecharCaixaOverlay();
  _verificarPendencias();
  try { _updateCaixaStatusBadge(); } catch(e){}

  // Abrir impressão automaticamente
  if (sucesso > 0) {
    _abrirImpressaoFechamento({ dias: diasParaFechar, moeda: _moeda, recolhido: _recolhido });
  }
}

async function _reimprimir(dataISO) {
  try {
    var info = { moeda: 0, recolhido: 0 };
    if (typeof window.buscarFechamentoPorData === 'function') {
      var dados = await window.buscarFechamentoPorData(dataISO);
      if (dados) { info.moeda = dados.moeda || 0; info.recolhido = dados.recolhido || 0; }
    }
    _abrirImpressaoFechamento({ dias: [dataISO], moeda: info.moeda, recolhido: info.recolhido });
  } catch(e) {
    _abrirImpressaoFechamento({ dias: [dataISO], moeda: 0, recolhido: 0 });
  }
}

function _abrirImpressaoFechamento(dados) {
  var agora = new Date();
  var hora = ('0'+agora.getHours()).slice(-2) + ':' + ('0'+agora.getMinutes()).slice(-2);
  var dd = ('0'+agora.getDate()).slice(-2);
  var mm = ('0'+(agora.getMonth()+1)).slice(-2);
  var yyyy = agora.getFullYear();
  var dataFmt = dd + '/' + mm + '/' + yyyy;
  var moedaFmt = 'R$ ' + (dados.moeda || 0).toFixed(2).replace('.', ',');
  var recolhidoFmt = 'R$ ' + (dados.recolhido || 0).toFixed(2).replace('.', ',');
  var totalFmt = 'R$ ' + ((dados.moeda || 0) + (dados.recolhido || 0)).toFixed(2).replace('.', ',');
  var diasStr = dados.dias.map(function(d) {
    var p = d.split('-'); return p[2]+'/'+p[1]+'/'+p[0];
  }).join(', ');

  var win = window.open('', '_blank', 'width=420,height=320');
  if (!win) return;
  win.document.open();
  win.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8">');
  win.document.write('<title>Fechamento</title>');
  win.document.write('<style>');
  win.document.write('@page{size:105mm 74mm;margin:4mm}');
  win.document.write('body{font-family:Arial,sans-serif;font-size:11px;color:#000;margin:0;padding:0;width:97mm}');
  win.document.write('.center{text-align:center}.bold{font-weight:700}.big{font-size:15px;font-weight:700}');
  win.document.write('.line{border:none;border-top:1px dashed #000;margin:4px 0}');
  win.document.write('.row{display:flex;justify-content:space-between;margin:3px 0}');
  win.document.write('.label{color:#555}.val{font-weight:700}');
  win.document.write('.total-box{background:#000;color:#fff;padding:4px 8px;border-radius:3px;display:flex;justify-content:space-between;margin:4px 0}');
  win.document.write('@media print{button{display:none}}');
  win.document.write('</style></head><body>');
  win.document.write('<div class="center bold" style="font-size:13px;margin-bottom:2px">ALIANCA INFORMATICA</div>');
  win.document.write('<div class="center" style="font-size:9px;color:#555;margin-bottom:4px">Fechamento de Caixa</div>');
  win.document.write('<hr class="line">');
  win.document.write('<div class="row"><span class="label">Data:</span><span class="val">' + dataFmt + '</span></div>');
  win.document.write('<div class="row"><span class="label">Hora:</span><span class="val">' + hora + '</span></div>');
  win.document.write('<div class="row"><span class="label">Dia(s):</span><span class="val">' + diasStr + '</span></div>');
  win.document.write('<hr class="line">');
  win.document.write('<div class="row"><span class="label">Moeda (troco):</span><span class="val">' + moedaFmt + '</span></div>');
  win.document.write('<div class="row"><span class="label">Recolhido:</span><span class="val">' + recolhidoFmt + '</span></div>');
  win.document.write('<hr class="line">');
  win.document.write('<div class="total-box"><span>TOTAL CAIXA</span><span class="big">' + totalFmt + '</span></div>');
  win.document.write('<hr class="line">');
  win.document.write('<div class="center" style="font-size:9px;color:#777;margin-top:4px">Assinatura: ___________________</div>');
  win.document.write('<div style="margin-top:12px;text-align:center"><button onclick="window.print()" style="padding:6px 16px;font-size:12px;cursor:pointer">Imprimir</button></div>');
  win.document.write('</body></html>');
  win.document.close();
  setTimeout(function() { win.print(); }, 400);
}

function _dispensarBanner() {
  // dispensa por 1 hora
  localStorage.setItem(BANNER_DISMISS_KEY, String(Date.now() + 60*60*1000));
  document.getElementById('caixaPendenteBanner').style.display = 'none';
}

async function _verificarPendencias() {
  if (!window.carregarAtendimentosPorPeriodo) return;
  // respeita dispensa por 1h
  const dispensaAte = parseInt(localStorage.getItem(BANNER_DISMISS_KEY) || '0', 10);
  if (Date.now() < dispensaAte) return;

  try {
    const fim = _isoMinusDias(1);  // ontem
    const ini = _isoMinusDias(7);  // 7 dias atrás
    const data = await window.carregarAtendimentosPorPeriodo(ini, fim);
    const log = _getSentLog();
    const cacheFB = JSON.parse(localStorage.getItem('alianca_caixa_fb_cache_v1') || '{"dias":[]}');
    const fechados = Array.from(new Set([...(log.day || []), ...cacheFB.dias]));
    const porDia = {};
    data.forEach(a => {
      const d = a.data;
      if (!d || fechados.includes(d)) return;
      porDia[d] = porDia[d] || { fat: 0, at: 0 };
      porDia[d].fat += a.total || 0;
      porDia[d].at += 1;
    });
    const pendentes = Object.keys(porDia).sort();
    const banner = document.getElementById('caixaPendenteBanner');
    const txt = document.getElementById('caixaPendenteBannerTxt');
    if (pendentes.length > 0) {
      const totalFat = pendentes.reduce((s,d) => s + porDia[d].fat, 0);
      const labels = pendentes.length === 1
        ? `Caixa de ${_ddmmaaaa(pendentes[0])} não foi fechado (${_brlSimples(porDia[pendentes[0]].fat)})`
        : `${pendentes.length} caixas atrasados (${_brlSimples(totalFat)} no total)`;
      txt.textContent = '⚠️ ' + labels;
      banner.style.display = 'block';
      document.body.style.paddingTop = (banner.offsetHeight || 44) + 'px';
    } else {
      banner.style.display = 'none';
      document.body.style.paddingTop = '';
    }
  } catch (e) { console.error('Erro verificar pendências:', e); }
}

function _ddmmaaaa(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}
function _diaDaSemana(iso) {
  if (!iso) return '';
  const p = iso.split('-');
  const d = new Date(parseInt(p[0]), parseInt(p[1])-1, parseInt(p[2]));
  return ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][d.getDay()];
}

/* ---------- Lembrete automático de fechamento ---------- */
function _getLembreteCfg() {
  try {
    const c = JSON.parse(localStorage.getItem(LEMBRETE_KEY) || 'null');
    return c || { ativo: true, hora: '18:00' };
  } catch (e) { return { ativo: true, hora: '18:00' }; }
}
function _salvarLembrete() {
  const hora = document.getElementById('tgLembreteHora').value || '18:00';
  const ativo = document.getElementById('tgLembreteAtivo').checked;
  localStorage.setItem(LEMBRETE_KEY, JSON.stringify({ ativo, hora }));
  const msg = document.getElementById('tgConfigMsg');
  msg.textContent = '✓ Lembrete ' + (ativo ? `ativado às ${hora}` : 'desativado');
  msg.style.color = '#28a745';
}
async function _verificarLembrete() {
  if (!_tgGet()) return;
  const cfg = _getLembreteCfg();
  if (!cfg.ativo) return;
  const agora = new Date();
  // só segunda a sábado
  if (agora.getDay() === 0) return;
  const [hh, mm] = cfg.hora.split(':').map(Number);
  // só dispara DEPOIS do horário configurado
  if (agora.getHours() < hh || (agora.getHours() === hh && agora.getMinutes() < mm)) return;

  const hojeKey = 'lembrete_' + _hojeISO();
  if (_foiEnviado('lembrete', hojeKey)) return; // só manda 1x por dia

  // verifica se hoje já foi fechado (local OU Firebase)
  const log = _getSentLog();
  const cacheFB = JSON.parse(localStorage.getItem('alianca_caixa_fb_cache_v1') || '{"dias":[]}');
  if ((log.day || []).includes(_hojeISO()) || cacheFB.dias.includes(_hojeISO())) return;

  // tem atendimentos hoje?
  try {
    const data = await window.carregarAtendimentosPorPeriodo(_hojeISO(), _hojeISO());
    if (data.length === 0) return; // dia vazio, sem necessidade de lembrar
    const total = data.reduce((s,a) => s + (a.total || 0), 0);
    const txt = `🔔 *Lembrete — Aliança*\n\nVocê ainda não fechou o caixa de hoje (${_ddmmaaaa(_hojeISO())}).\n\n💰 Total até agora: *${_brlSimples(total)}*\n🎯 Atendimentos: ${data.length}\n\n_Abra o site e clique em "Fechar Caixa do Dia" pra encerrar._`;
    const r = await _tgSend(txt);
    if (r.ok) { _marcarEnviado('lembrete', hojeKey); console.log('Lembrete enviado:', hojeKey); }
  } catch (e) { console.error('Falha lembrete:', e); }
}

/* ---------- Agendamentos automáticos (semanal/mensal) ---------- */
function _getSentLog() {
  try { return JSON.parse(localStorage.getItem(TG_SENT_KEY) || '{}'); } catch (e) { return {}; }
}
function _marcarEnviado(tipo, chave) {
  const log = _getSentLog();
  if (!log[tipo]) log[tipo] = [];
  if (!log[tipo].includes(chave)) log[tipo].push(chave);
  // mantém só os últimos 30 registros por tipo
  if (log[tipo].length > 30) log[tipo] = log[tipo].slice(-30);
  localStorage.setItem(TG_SENT_KEY, JSON.stringify(log));
  // v3.0: se for fechamento de dia, persiste no Firebase também (sincroniza entre PCs)
  if (tipo === 'day' && window.fecharCaixaFirebase) {
    // Atualiza cache local imediatamente (UI instantânea)
    try {
      const cache = JSON.parse(localStorage.getItem('alianca_caixa_fb_cache_v1') || '{"dias":[]}');
      if (!cache.dias.includes(chave)) cache.dias.push(chave);
      localStorage.setItem('alianca_caixa_fb_cache_v1', JSON.stringify(cache));
    } catch (e) {}
    // Persiste em Firestore (assincrono — não trava UI)
    (async () => {
      try {
        let info = { atendimentos: 0, total: 0 };
        if (window.carregarAtendimentosPorPeriodo) {
          const dados = await window.carregarAtendimentosPorPeriodo(chave, chave);
          info.atendimentos = dados.length;
          info.total = dados.reduce((s, a) => s + (a.total || 0), 0);
        }
        await window.fecharCaixaFirebase(chave, info);
        try { _updateCaixaStatusBadge(); } catch(e){}
      } catch (e) { console.warn('Falha sync caixa Firebase:', e); }
    })();
  }
}

// v3.0: sincroniza cache local com lista de fechamentos do Firebase
async function _sincronizarCacheCaixaFirebase() {
  if (!window.listarCaixaFechamentos) return;
  try {
    const fim = _hojeISO();
    const ini = _isoMinusDias(30);
    const dias = await window.listarCaixaFechamentos(ini, fim);
    localStorage.setItem('alianca_caixa_fb_cache_v1', JSON.stringify({ dias, atualizadoEm: Date.now() }));
    try { _updateCaixaStatusBadge(); } catch(e){}
    return dias;
  } catch (e) { console.warn('Falha sincronizar cache caixa:', e); return null; }
}
window._sincronizarCacheCaixaFirebase = _sincronizarCacheCaixaFirebase;
function _foiEnviado(tipo, chave) {
  const log = _getSentLog();
  return (log[tipo] || []).includes(chave);
}
function _yearWeek(d) {
  // ISO week number
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() + 4 - (t.getDay()||7));
  const yearStart = new Date(t.getFullYear(),0,1);
  const week = Math.ceil((((t - yearStart)/86400000) + 1)/7);
  return t.getFullYear() + '-W' + String(week).padStart(2,'0');
}
async function _verificarAgendamentos() {
  if (!_tgGet() || !window.carregarAtendimentosPorPeriodo) return;
  const agora = new Date();
  const hora = agora.getHours();
  if (hora < 8) return; // só dispara após 8h

  // SEMANAL: toda segunda-feira (getDay() === 1)
  if (agora.getDay() === 1) {
    const chaveSem = _yearWeek(agora);
    if (!_foiEnviado('week', chaveSem)) {
      const fim = _isoMinusDias(1);  // domingo
      const ini = _isoMinusDias(7);  // segunda anterior
      try {
        const data = await window.carregarAtendimentosPorPeriodo(ini, fim);
        const txt = _gerarResumoTexto('📅 Resumo Semanal (segunda passada → domingo)', ini, fim, data);
        const r = await _tgSend(txt);
        if (r.ok) { _marcarEnviado('week', chaveSem); console.log('Resumo semanal enviado:', chaveSem); }
      } catch (e) { console.error('Falha agendamento semanal:', e); }
    }
  }

  // MENSAL: todo dia 1º
  if (agora.getDate() === 1) {
    const chaveMes = agora.getFullYear() + '-' + String(agora.getMonth()+1).padStart(2,'0');
    if (!_foiEnviado('month', chaveMes)) {
      // mês anterior
      const fim = _isoMinusDias(1);
      const primDiaMesAnt = new Date(agora.getFullYear(), agora.getMonth()-1, 1);
      const ini = primDiaMesAnt.getFullYear() + '-' + String(primDiaMesAnt.getMonth()+1).padStart(2,'0') + '-01';
      try {
        const data = await window.carregarAtendimentosPorPeriodo(ini, fim);
        const txt = _gerarResumoTexto('🗓️ Resumo Mensal', ini, fim, data);
        const r = await _tgSend(txt);
        if (r.ok) { _marcarEnviado('month', chaveMes); console.log('Resumo mensal enviado:', chaveMes); }
      } catch (e) { console.error('Falha agendamento mensal:', e); }
    }
  }
}

/* Dispara agendamentos + verifica pendências + lembrete */
(function _bootTelegramAndStatus(){
  function _onReady(){
    try { _tgUpdateBadge(); } catch(e){}
    try { _updateCaixaStatusBadge(); } catch(e){}
    // popula campos do lembrete no overlay
    try {
      const cfgL = _getLembreteCfg();
      const inputH = document.getElementById('tgLembreteHora');
      const inputA = document.getElementById('tgLembreteAtivo');
      if (inputH) inputH.value = cfgL.hora;
      if (inputA) inputA.checked = cfgL.ativo;
    } catch(e){}

    let _checkTimer = null;
    function _runChecks(){
      try { _sincronizarCacheCaixaFirebase(); } catch(e){} // v3.0: refresca cache primeiro
      try { _verificarAgendamentos(); } catch(e){}
      try { _verificarPendencias(); } catch(e){}
      try { _verificarLembrete(); } catch(e){}
      try { _updateCaixaStatusBadge(); } catch(e){}
    }
    function _startTimer(){
      if (_checkTimer) return;
      _checkTimer = setInterval(_runChecks, 15 * 60 * 1000);
    }
    function _stopTimer(){
      if (_checkTimer) { clearInterval(_checkTimer); _checkTimer = null; }
    }
    // primeira execução após 5s
    setTimeout(_runChecks, 5000);
    _startTimer();
    // Otimização: pausa timer quando aba escondida; roda check ao voltar
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) { _stopTimer(); }
      else { _runChecks(); _startTimer(); }
    });
    // Sincroniza badge entre abas
    window.addEventListener('storage', function(ev){
      if (ev.key === 'alianca_tg_sent_log_v1') _updateCaixaStatusBadge();
    });
  }
  if (document.readyState === 'complete') _onReady();
  else window.addEventListener('load', _onReady, { once: true });
})();

/* ESC fecha overlays */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.getElementById('tgConfigOverlay').classList.contains('open')) fecharConfigTelegram();
    else if (document.getElementById('fecharCaixaOverlay').classList.contains('open')) fecharFecharCaixaOverlay();
    else if (document.getElementById('dashOverlay').classList.contains('open')) fecharDashboard();
  }
});

/* Expor globalmente */
window.abrirDashboard = abrirDashboard;
window.fecharDashboard = fecharDashboard;
window.abrirConfigTelegram = abrirConfigTelegram;
window.fecharConfigTelegram = fecharConfigTelegram;
window.enviarResumoManual = enviarResumoManual;
window.fecharCaixaDoDia = fecharCaixaDoDia;
window.abrirFecharCaixaAvancado = abrirFecharCaixaAvancado;
window.fecharFecharCaixaOverlay = fecharFecharCaixaOverlay;
window._executarFechamento = _executarFechamento;
window._atualizarBtnFechar = _atualizarBtnFechar;
window._dispensarBanner = _dispensarBanner;
window._salvarLembrete = _salvarLembrete;
window._dashSet = _dashSet;
window._tgSave = _tgSave;
window._tgClear = _tgClear;
window._tgTest = _tgTest;
window._updateCaixaStatusBadge = _updateCaixaStatusBadge;
window._verificarPendencias = _verificarPendencias;
window._verificarLembrete = _verificarLembrete;
