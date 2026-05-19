/* ===========================
   ALIANÇA — FIREBASE
   =========================== */

  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    doc,
    setDoc,
    updateDoc,
    increment,
    writeBatch,
    getDoc
  } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.firebasestorage.app",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:000000000000"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Salvar atendimento no Firestore
  async function salvarAtendimento(at) {
    // Cria payload limpo (sem campos internos do site)
    const payload = {
      id: at.id,
      time: at.time,
      items: at.items,
      total: at.total,
      data: at.data,
      hora: at.hora,
      criadoEm: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, "atendimentos"), payload);
    at._docId = docRef.id;
    console.log("Atendimento salvo no Firestore:", docRef.id);
    return docRef.id;
  }

  // Excluir atendimento do Firestore
  async function excluirAtendimento(docId) {
    if (!docId) throw new Error('docId vazio');
    await deleteDoc(doc(db, "atendimentos", docId));
    console.log("Atendimento excluído do Firestore:", docId);
    return true;
  }

  // Carregar atendimentos por período (intervalo de datas ISO inclusive)
  async function carregarAtendimentosPorPeriodo(dataInicioISO, dataFimISO) {
    try {
      const colRef = collection(db, "atendimentos");
      const qRef = query(
        colRef,
        where("data", ">=", dataInicioISO),
        where("data", "<=", dataFimISO),
        orderBy("data", "asc"),
        orderBy("hora", "asc")
      );
      const snap = await getDocs(qRef);
      const lista = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        lista.push({
          _docId: docSnap.id,
          id: d.id || null,
          time: d.time || d.hora || '--:--',
          items: d.items || [],
          total: d.total || 0,
          data: d.data,
          hora: d.hora,
          criadoEm: d.criadoEm || null
        });
      });
      return lista;
    } catch (e) {
      console.error("Erro ao carregar período:", e);
      throw e;
    }
  }

  // Carregar TODOS atendimentos (para export geral)
  async function carregarTodosAtendimentos() {
    try {
      const colRef = collection(db, "atendimentos");
      const qRef = query(colRef, orderBy("data", "asc"), orderBy("hora", "asc"));
      const snap = await getDocs(qRef);
      const lista = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        lista.push({
          _docId: docSnap.id,
          id: d.id || null,
          time: d.time || d.hora || '--:--',
          items: d.items || [],
          total: d.total || 0,
          data: d.data,
          hora: d.hora,
          criadoEm: d.criadoEm || null
        });
      });
      return lista;
    } catch (e) {
      console.error("Erro ao carregar todos atendimentos:", e);
      throw e;
    }
  }

// Carregar atendimentos do dia (por data ISO: "2026-05-13")
// Carregar atendimentos do dia direto do Firestore,
// retornando já no formato que o histórico usa (_atendimentos)
async function carregarAtendimentosDoDia(dataISO) {
    try {
      const colRef = collection(db, "atendimentos");
      const qRef = query(
        colRef,
        where("data", "==", dataISO),
        orderBy("hora", "asc")
      );
      const snap = await getDocs(qRef);
      const lista = [];
      snap.forEach(docSnap => {
        const d = docSnap.data();
        lista.push({
          _docId: docSnap.id,
          id: d.id || null,
          time: d.time || d.hora || '--:--',
          items: d.items || [],
          total: d.total || 0,
          data: d.data,
          hora: d.hora
        });
      });
      console.log("Atendimentos do dia:", lista);
      return lista;
    } catch (e) {
      console.error("Erro ao carregar atendimentos:", e);
      return [];
    }
  }

// Ao abrir a página, busca atendimentos de hoje (data LOCAL) e preenche o histórico
  window.addEventListener("load", async () => {
    // data local (não UTC) — evita pular 1 dia no Brasil de madrugada
    const d = new Date();
    const dataISO = d.getFullYear() + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' + ('0'+d.getDate()).slice(-2);
    const listaFS = await carregarAtendimentosDoDia(dataISO);
    if (listaFS.length > 0) {
      // marca como já sincronizados
      listaFS.forEach(a => { a._syncStatus = 'saved'; });
      _atendimentos = listaFS.concat(_atendimentos || []);
      var maxId = 0;
      for (var i = 0; i < _atendimentos.length; i++) {
        if (_atendimentos[i].id && _atendimentos[i].id > maxId) maxId = _atendimentos[i].id;
      }
      if (maxId > 0) _atenCount = maxId;
      _renderHistory();
      _updateDayTotal();
    }
  });

  // Verifica a cada minuto se o dia mudou — se sim, limpa o histórico do site
  // (o Firebase continua guardando tudo, mas o site mostra só o dia atual)
  let _ultimaDataISO = (() => { const d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); })();
  setInterval(() => {
    const d = new Date();
    const dataAgora = d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
    if (dataAgora !== _ultimaDataISO) {
      console.log('Dia mudou de', _ultimaDataISO, 'para', dataAgora, '— atualizando histórico');
      _ultimaDataISO = dataAgora;
      // re-renderiza (o filtro _atendimentosDoDia esconde automaticamente os de ontem)
      if (typeof _renderHistory === 'function') _renderHistory();
      if (typeof _updateDayTotal === 'function') _updateDayTotal();
    }
  }, 60000);

  // ============================================================
  // PRODUTOS / ESTOQUE (coleção: produtos)
  // Documento ID = string do código do produto (codigo)
  // ============================================================

  async function carregarProdutos() {
    try {
      const snap = await getDocs(query(collection(db, 'produtos'), orderBy('nome', 'asc')));
      const lista = [];
      snap.forEach(d => { lista.push({ _docId: d.id, ...d.data() }); });
      return lista;
    } catch (e) {
      console.error('Erro carregarProdutos:', e);
      return [];
    }
  }

  async function salvarProduto(prod) {
    // prod = { codigo, nome, grupo, subgrupo, preco, unid, estoque, estoqueMinimo, ativo, origem }
    if (!prod.codigo) throw new Error('produto sem código');
    const docId = String(prod.codigo);
    const payload = {
      codigo: Number(prod.codigo),
      nome: String(prod.nome || '').trim(),
      grupo: String(prod.grupo || 'OUTROS').trim(),
      subgrupo: String(prod.subgrupo || '').trim(),
      preco: Number(prod.preco) || 0,
      unid: String(prod.unid || 'UN').trim(),
      estoque: Number(prod.estoque) || 0,
      estoqueMinimo: Number(prod.estoqueMinimo) || 0,
      ativo: prod.ativo !== false,
      origem: prod.origem || 'manual',
      atualizadoEm: new Date().toISOString()
    };
    await setDoc(doc(db, 'produtos', docId), payload, { merge: true });
    return docId;
  }

  async function deletarProduto(codigo) {
    await deleteDoc(doc(db, 'produtos', String(codigo)));
  }

  async function entradaEstoque(codigo, quantidade, motivo) {
    // Soma quantidade ao estoque (atomicamente)
    const ref = doc(db, 'produtos', String(codigo));
    await updateDoc(ref, {
      estoque: increment(Number(quantidade)),
      atualizadoEm: new Date().toISOString()
    });
    // Registra movimento de auditoria
    await addDoc(collection(db, 'estoque_movimentos'), {
      codigo: Number(codigo),
      tipo: 'entrada',
      quantidade: Number(quantidade),
      motivo: motivo || 'Entrada manual',
      em: new Date().toISOString()
    });
  }

  async function baixaEstoque(codigo, quantidade, atendimentoId) {
    // Subtrai quantidade do estoque (permite negativo — conforme decisão do usuário)
    const ref = doc(db, 'produtos', String(codigo));
    try {
      await updateDoc(ref, {
        estoque: increment(-Math.abs(Number(quantidade))),
        atualizadoEm: new Date().toISOString()
      });
      await addDoc(collection(db, 'estoque_movimentos'), {
        codigo: Number(codigo),
        tipo: 'venda',
        quantidade: Number(quantidade),
        atendimentoId: atendimentoId || null,
        em: new Date().toISOString()
      });
    } catch (e) {
      // produto inexistente — ignora silenciosamente (serviços do governo não têm doc de produto)
      if (e.code !== 'not-found') console.warn('baixaEstoque falhou:', e.message);
    }
  }

  async function importarProdutosEmLote(lista) {
    // Importa em batches de 400 (limite Firestore: 500)
    let total = 0;
    for (let i = 0; i < lista.length; i += 400) {
      const chunk = lista.slice(i, i + 400);
      const batch = writeBatch(db);
      chunk.forEach(p => {
        const docId = String(p.codigo);
        const ref = doc(db, 'produtos', docId);
        batch.set(ref, {
          codigo: Number(p.codigo),
          nome: String(p.nome || '').trim(),
          grupo: String(p.grupo || 'OUTROS').trim(),
          subgrupo: String(p.subgrupo || '').trim(),
          preco: Number(p.preco) || 0,
          unid: String(p.unid || 'UN').trim(),
          estoque: Number(p.estoque) || 0,
          estoqueMinimo: Number(p.estoqueMinimo) || 0,
          ativo: true,
          origem: 'SMB',
          atualizadoEm: new Date().toISOString()
        }, { merge: true });
      });
      await batch.commit();
      total += chunk.length;
      console.log(`Importados ${total}/${lista.length} produtos`);
    }
    return total;
  }

  // ============================================================
  // FECHAMENTO DE CAIXA (coleção: caixa_fechamentos)
  // Documento ID = data ISO (ex: "2026-05-14")
  // Substitui o localStorage — sincroniza entre todos os PCs
  // ============================================================

  async function fecharCaixaFirebase(dataISO, info) {
    const payload = {
      data: dataISO,
      fechadoEm: new Date().toISOString(),
      fechadoPor: (navigator.userAgent || '').slice(0, 100),
      atendimentos: (info && info.atendimentos) || 0,
      total: (info && info.total) || 0,
      moeda: (info && info.moeda) || 0,
      recolhido: (info && info.recolhido) || 0
    };
    await setDoc(doc(db, 'caixa_fechamentos', dataISO), payload, { merge: true });
    return payload;
  }

  async function reabrirCaixaFirebase(dataISO) {
    await deleteDoc(doc(db, 'caixa_fechamentos', dataISO));
  }

  async function listarCaixaFechamentos(inicioISO, fimISO) {
    try {
      const qRef = query(
        collection(db, 'caixa_fechamentos'),
        where('data', '>=', inicioISO),
        where('data', '<=', fimISO)
      );
      const snap = await getDocs(qRef);
      const dias = [];
      snap.forEach(d => dias.push(d.data().data));
      return dias;
    } catch (e) {
      console.error('Erro listarCaixaFechamentos:', e);
      return [];
    }
  }

  async function caixaJaFechado(dataISO) {
    try {
      const snap = await getDoc(doc(db, 'caixa_fechamentos', dataISO));
      return snap.exists();
    } catch (e) { return false; }
  }

  // ============================================================
  // DESPESAS (coleção: despesas)
  // ============================================================

  async function salvarDespesaFirebase(desp) {
    const docRef = await addDoc(collection(db, 'despesas'), desp);
    console.log('Despesa salva:', docRef.id);
    return docRef.id;
  }

  async function atualizarDespesaFirebase(docId, dados) {
    const ref = doc(db, 'despesas', docId);
    const { docId: _, ...payload } = dados;
    await updateDoc(ref, payload);
    console.log('Despesa atualizada:', docId);
  }

  async function excluirDespesaFirebase(docId) {
    await deleteDoc(doc(db, 'despesas', docId));
    console.log('Despesa excluída:', docId);
  }

  async function carregarDespesasHoje(dataISO) {
    try {
      const q = query(
        collection(db, 'despesas'),
        where('data', '==', dataISO),
        orderBy('criadoEm', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ docId: d.id, ...d.data() }));
    } catch (e) {
      console.error('Erro ao carregar despesas:', e);
      return [];
    }
  }

  async function buscarFechamentoPorData(dataISO) {
    try {
      const snap = await getDoc(doc(db, 'caixa_fechamentos', dataISO));
      if (snap.exists()) return snap.data();
      return null;
    } catch (e) {
      console.error('Erro ao buscar fechamento:', e);
      return null;
    }
  }

  try {
    window.salvarAtendimento = salvarAtendimento;
    window.excluirAtendimento = excluirAtendimento;
    window.carregarAtendimentosDoDia = carregarAtendimentosDoDia;
    window.carregarAtendimentosPorPeriodo = carregarAtendimentosPorPeriodo;
    window.carregarTodosAtendimentos = carregarTodosAtendimentos;
    // Produtos / estoque
    window.carregarProdutos = carregarProdutos;
    window.salvarProduto = salvarProduto;
    window.deletarProduto = deletarProduto;
    window.entradaEstoque = entradaEstoque;
    window.baixaEstoque = baixaEstoque;
    window.importarProdutosEmLote = importarProdutosEmLote;
    window.db = db;
    window.getDoc = getDoc;
    window.doc = doc;
    window.salvarDespesaFirebase    = salvarDespesaFirebase;
    window.atualizarDespesaFirebase = atualizarDespesaFirebase;
    window.excluirDespesaFirebase   = excluirDespesaFirebase;
    window.carregarDespesasHoje     = carregarDespesasHoje;
    // Fechamento caixa
    window.fecharCaixaFirebase = fecharCaixaFirebase;
    window.reabrirCaixaFirebase = reabrirCaixaFirebase;
    window.listarCaixaFechamentos = listarCaixaFechamentos;
    window.caixaJaFechado = caixaJaFechado;
    window.buscarFechamentoPorData    = buscarFechamentoPorData;
    console.log('Funções Firestore expostas em window');
  } catch (e) {
    console.error('Erro ao expor funções no window:', e);
  }