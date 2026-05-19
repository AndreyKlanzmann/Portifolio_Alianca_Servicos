/* ===========================
   ALIANÇA — DATA
   =========================== */

// ---- DATA ----
const SERVICES = [
  // DETRAN
  {cat:'detran', name:'IPVA', obs:'Emissão e pagamento do IPVA do veículo', price:'R$ 6,00', url:'https://veiculosmg.fazenda.mg.gov.br/'},
  {cat:'detran', name:'Guia IPVA Parcelado', obs:'Emissão de guia para pagamento parcelado do IPVA', price:'R$ 6,00', url:'https://www2.fazenda.mg.gov.br/sol/ctrl/SOL/PARCEL/CONSULTA_003?ACAO=VISUALIZAR'},
  {cat:'detran', name:'Parcelamento IPVA', obs:'Consulta e solicitação de parcelamento do IPVA', price:'R$ 50,00', url:'https://www2.fazenda.mg.gov.br/sol/ctrl/SOL/PARCEL/CONSULTA_017?ACAO=VISUALIZAR'},
  {cat:'detran', name:'Consulta Veículo', obs:'Consultar situação do veículo no Detran', price:'R$ 4,00 / R$ 8,00', url:'https://detran.mg.gov.br/veiculos/situacao-do-veiculo/consultar-situacao-do-veiculo'},
  {cat:'detran', name:'Imprimir CRLV', obs:'Emissão digital do documento do veículo (CRLV)', price:'R$ 6,00', url:'https://detran.mg.gov.br/veiculos/documentos-de-veiculos/emissao-do-clrv'},
  {cat:'detran', name:'Multas', obs:'1ª via: R$ 6,00 · A partir da 2ª: R$ 2,50 cada (preço fixo de impressão, sem desconto progressivo)', price:'R$ 6,00 / R$ 2,50', url:'https://detran.mg.gov.br/veiculos/situacao-do-veiculo/emitir-de-extrato-de-multas'},
  {cat:'detran', name:'Intenção de Venda', obs:'Registrar intenção de venda do veículo', price:'R$ 50,00', url:'https://transito.mg.gov.br/veiculos/transferencias/realizar-a-venda-de-um-veiculo-vendi-meu-veiculo'},
  {cat:'detran', name:'Decalque de Chassi', obs:'Taxa para transferir propriedade de veículo (comprador)', price:'R$ 50,00', url:'https://www.detran.mg.gov.br/veiculos/transferencias/taxa-para-transferir-propriedade-de-veiculo-comprador/index/2'},
  {cat:'detran', name:'Renovação CNH', obs:'Emissão da taxa de renovação da CNH', price:'R$ 30,00', url:'https://detran.mg.gov.br/habilitacao/renovacao-da-cnh-1/taxa-da-renovacao-do-documento-de-habilitacao'},
  {cat:'detran', name:'Agendamento Renovação CNH', obs:'Agendamento/reagendamento de clínica médica para renovação', price:'R$ 17,00', url:'https://detran.mg.gov.br/habilitacao/renovacao-da-cnh-1/agendamento-reagendamento-clinica-medica-4'},
  {cat:'detran', name:'DAE Prova de Legislação', obs:'Emitir taxa para prova de legislação (1ª habilitação)', price:'R$ 30,00', url:'https://detran.mg.gov.br/habilitacao/1-habilitacao-quero-ser-condutor/detran.mg.gov.br/habilitacao/outros-servicos-e-taxas/emitir-taxa-de-servico-de-habilitacao/preencher-dados-da-habilitacao/18'},
  {cat:'detran', name:'Agendamento Prova de Legislação', obs:'Agendar exame de legislação (candidato)', price:'R$ 17,00', url:'https://detran.mg.gov.br/habilitacao/1-habilitacao-quero-ser-condutor/agendar-exame-de-legislacao-candidato'},

  // MEI
  {cat:'mei', name:'Consulta Situação MEI (CCMEI)', obs:'Verificar situação cadastral do Microempreendedor Individual', price:'R$ 40,00', url:'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor'},
  {cat:'mei', name:'Declaração do MEI (DASN)', obs:'Enviar declaração anual do MEI no Simples Nacional', price:'R$ 80,00', url:'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/dasnsimei.app/Identificacao'},
  {cat:'mei', name:'NF do MEI', obs:'Emissão de nota fiscal pelo Emissor Nacional', price:'R$ 25,00', url:'https://www.nfse.gov.br/EmissorNacional/Login?ReturnUrl=%2fEmissorNacional'},
  {cat:'mei', name:'Guia DAS MEI', obs:'Emissão do boleto mensal de pagamento do MEI', price:'R$ 6,00', url:'https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao'},
  {cat:'mei', name:'Parcelamento MEI', obs:'Parcelamento de débitos do Simples Nacional', price:'R$ 65,00', url:'https://www8.receita.fazenda.gov.br/SimplesNacional/Servicos/Grupo.aspx?grp=19'},
  {cat:'mei', name:'SISPAR — Guia de Parcelamento (Dívida Federal)', obs:'Emitir guia de parcela de dívida federal. Inserir CPF/CNPJ, nº de parcela já paga e selecionar tipo "Parcela".', price:'R$ 6,00', url:'https://sisparnet.pgfn.fazenda.gov.br/sisparInternet/internet/darf/consultaParcelamentoDarfInternet.xhtml'},
  {cat:'mei', name:'Abertura MEI', obs:'Formalização como Microempreendedor Individual', price:'R$ 140,00', url:'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/quero-ser-mei'},

  // GOV
  {cat:'gov', name:'Assinatura GOV (Assinador ITI)', obs:'Assinar documentos digitalmente pelo gov.br', price:'R$ 7,00', url:'https://assinador.iti.br'},
  {cat:'gov', name:'Desativar Autenticação 2FA', obs:'Suporte para desativação de verificação em dois fatores', price:'R$ 20,00', url:'https://atendimento.acesso.gov.br/'},
  {cat:'gov', name:'Agendamento UAI', obs:'Agendamento online gratuito de atendimento presencial', price:'R$ 17,00', url:'https://www.mg.gov.br/pagina/agendamento-online-gratuito'},
  {cat:'gov', name:'Aumento de Nível GOV', obs:'Formas: Facial (R$ 10) / Banco (R$ 15) / QR Code da Carteira de Identidade Nova. Se junto com recuperação de senha: R$ 20. Conta sobe automaticamente após o procedimento.', price:'R$ 10 / R$ 15 / R$ 20', url:'https://acesso.gov.br'},
  {cat:'gov', name:'Recuperação de Senha GOV', obs:'Redefinir senha de acesso à conta gov.br', price:'R$ 15,00', url:'https://acesso.gov.br'},

  // INSS
  {cat:'inss', name:'Emissão de Guia de Pagamento (SAL)', obs:'Emitir guia de recolhimento facultativo pelo sistema SAL', price:'R$ 6,00', url:'https://sal.rfb.gov.br/home'},
  {cat:'inss', name:'Seguro-Desemprego', obs:'Solicitar benefício de seguro-desemprego online', price:'R$ 45,00', url:'https://www.gov.br/pt-br/servicos/solicitar-o-seguro-desemprego'},
  {cat:'inss', name:'Agendamento Perícia INSS', obs:'Agendar perícia médica pelo Meu INSS', price:'R$ 40,00', url:'https://meu.inss.gov.br/'},
  {cat:'inss', name:'Extrato CNIS', obs:'Consultar extrato de contribuições e vínculos pelo Meu INSS', price:'R$ 6,00', url:'https://meu.inss.gov.br/'},
  {cat:'inss', name:'Alteração Cadastral INSS', obs:'Alterar dados cadastrais no INSS (ex: mudança de nome após casamento).', price:'R$ 20,00', url:'https://meu.inss.gov.br/'},
  {cat:'inss', name:'Carteirinha de Pesca', obs:'Solicitar licença de pescador amador ou esportivo', price:'R$ 30,00', url:'https://www.gov.br/pt-br/servicos/solicitar-licenca-de-pescador-amador-ou-esportivoo'},

  // CEMIG
  {cat:'cemig', name:'Troca de Titularidade CEMIG', obs:'Transferência de titularidade da conta CEMIG via videoatendimento online.', price:'R$ 50,00', url:'https://videoatendimento.cemig.com.br'},

  // 2ª VIA CONTAS
  {cat:'contas', name:'2ª Via CEMIG', obs:'Contato via WhatsApp ou Telegram da CEMIG', price:'R$ 4,75', url:null, obs2:'Whatsapp ou Telegram'},
  {cat:'contas', name:'2ª Via CESAMA', obs:'Emissão de 2ª via de conta de água (CESAMA)', price:'R$ 4,75', url:'https://cesama.strategos.com.br:8443/AgenciaVirtualNovo/'},
  {cat:'contas', name:'2ª Via TIM', obs:'Emissão de 2ª via de fatura TIM', price:'R$ 4,75', url:'https://www.tim.com.br/ajuda/conta'},
  {cat:'contas', name:'2ª Via CLARO', obs:'Emissão de 2ª via de fatura Claro', price:'R$ 4,75', url:'https://www.claro.com.br/minha/publico/fatura-facil'},
  {cat:'contas', name:'2ª Via VIVO', obs:'Atendimento via aplicativo Vivo', price:'R$ 4,75', url:null, obs2:'Aplicativo'},
  {cat:'contas', name:'2ª Via VERO', obs:'Emissão de 2ª via de internet Vero', price:'R$ 4,75', url:'https://verointernet.com.br/minhavero/login'},
  {cat:'contas', name:'2ª Via Velozes (Internet)', obs:'Emissão de 2ª via do provedor Velozes', price:'R$ 4,75', url:'https://velozesprovedor.sgp.net.br/accounts/central/login'},
  {cat:'contas', name:'2ª Via Unimed (JF)', obs:'Emissão de 2ª via de boleto Unimed Juiz de Fora', price:'R$ 4,75', url:'https://www.unimedjf.coop.br/clientefisico/segunda-via-boletoItau?choice=true'},
  {cat:'contas', name:'2ª Via IPTU', obs:'Emissão de 2ª via do IPTU Municipal (PJF)', price:'R$ 6,00', url:'https://tributos4.pjf.mg.gov.br/iptu/'},
  {cat:'contas', name:'2ª Via NIO', obs:'Atendimento via WhatsApp', price:'R$ 4,75', url:null, obs2:'Whatsapp'},
  {cat:'contas', name:'2ª Via de Cartão', obs:'Atendimento via aplicativo do banco/operadora', price:'R$ 4,75', url:null, obs2:'Aplicativo'},

  // DOCUMENTOS
  {cat:'docs', name:'Certidão Civil/Criminal (TRF 1ª Região)', obs:'Emitir certidão pelo sistema do TRF-1', price:'R$ 12,00', url:'https://sistemas.trf1.jus.br/certidao/#/solicitacao'},
  {cat:'docs', name:'Certidão Civil/Criminal (TRF 6ª Região)', obs:'Emitir certidão pelo sistema do TRF-6', price:'R$ 12,00', url:'https://sistemas.trf6.jus.br/certidao/#/solicitacao'},
  {cat:'docs', name:'Certidão Cível/Criminal (TJ-MG)', obs:'Emitir certidão pelo Tribunal de Justiça de MG', price:'R$ 12,00', url:'https://rupe.tjmg.jus.br/rupe/justica/publico/certidoes/criarSolicitacaoCertidao.rupe?solicitacaoPublica=true'},
  {cat:'docs', name:'Antecedentes Criminais (Federal)', obs:'Emitir certidão de antecedentes pela Polícia Federal', price:'R$ 12,00', url:'https://servicos.pf.gov.br/epol-sinic-publico/'},
  {cat:'docs', name:'Antecedentes Criminais (PC-MG)', obs:'Emitir atestado pela Polícia Civil de Minas Gerais', price:'R$ 12,00', url:'https://www.policiacivil.mg.gov.br/pagina/emissao-atestado'},
  {cat:'docs', name:'Certidão de Quitação Eleitoral', obs:'Emitir certidão eleitoral pelo TSE', price:'R$ 12,00', url:'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/certidoes-eleitor'},
  {cat:'docs', name:'2ª Via CPF', obs:'Imprimir comprovante de inscrição no CPF (Receita Federal)', price:'R$ 7,00', url:'https://servicos.receita.fazenda.gov.br/servicos/cpf/impressaocomprovante/consultaimpressao.asp'},
  {cat:'docs', name:'2ª Via Título de Eleitor', obs:'Emitir 2ª via do título de eleitor pelo TSE', price:'R$ 7,00', url:'https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor'},

  // CONTRATOS
  {cat:'contratos', name:'Procuração', obs:'Elaboração de procuração (arquivo local no PC)', price:'R$ 30,00', url:null, localFile:true},
  {cat:'contratos', name:'Contrato de Compra e Venda', obs:'Contrato simples de compra e venda (arquivo local)', price:'R$ 45,00', url:null, localFile:true},
  {cat:'contratos', name:'Contrato de Aluguel Protetivo', obs:'Contrato de venda de imóvel — arquivo local', price:'R$ 45,00', url:null, localFile:true},
  {cat:'contratos', name:'Contrato de Aluguel Padrão', obs:'Contrato de locação padrão — arquivo local', price:'R$ 30,00', url:null, localFile:true},

  // INSCRIÇÕES
  {cat:'inscricoes', name:'Cadastro para Concurso', obs:'Inscrição em concurso público (site varia conforme edital)', price:'R$ 30,00', url:null},
  {cat:'inscricoes', name:'Isenção ENEM', obs:'Solicitar isenção da taxa de inscrição do ENEM pelo INEP', price:'R$ 30,00', url:'https://enem.inep.gov.br/participante/#!/'},

  // TRABALHOS
  {cat:'trabalhos', name:'Atualização de Currículo', obs:'Converter currículo PDF para Word via iLovePDF', price:'R$ 5,00', url:'https://www.ilovepdf.com/pt/pdf_para_word'},
  {cat:'trabalhos', name:'Currículo Padrão', obs:'Formatação de currículo no modelo padrão', price:'R$ 10,00', url:null},
  {cat:'trabalhos', name:'Currículo Personalizado', obs:'Criação de currículo com design personalizado', price:'R$ 15,00', url:null},
  {cat:'trabalhos', name:'Pesquisa Escolar Simples', obs:'Pesquisa e formatação de trabalho escolar simples', price:'R$ 20,00', url:null},
  {cat:'trabalhos', name:'Pesquisa Escolar Complexa', obs:'Pesquisa e formatação de trabalho escolar complexo', price:'R$ 30,00', url:null},
  {cat:'trabalhos', name:'Formatação de Texto', obs:'Formatação de documento de texto (ABNT, etc.)', price:'R$ 10,00', url:null},
  {cat:'trabalhos', name:'Digitação de Texto', obs:'Até 5 páginas por cobrança. Se ultrapassar, o valor é recobrado (ex: 6 a 10 pág = + R$ 15,00).', price:'R$ 15,00', url:null},
  {cat:'trabalhos', name:'Digitação (Placa)', obs:'Digitação e formatação para placa', price:'R$ 8,50', url:null},
  {cat:'trabalhos', name:'Ajuste de Arte', obs:'Ajuste de imagem ou arte digital', price:'R$ 5,00 + Impressão', url:null},

  // EMAIL E FOTOS
  {cat:'email', name:'Criação de E-mail (Gmail)', obs:'Criar conta de e-mail no Gmail', price:'R$ 15,00', url:'https://mail.google.com/'},
  {cat:'email', name:'Envio de E-mail', obs:'Auxílio no envio de e-mail com anexo', price:'R$ 7,00', url:null},
  {cat:'email', name:'Foto Polaroid', obs:'Criação de foto estilo polaroid no Canva', price:'R$ 12,00', url:'https://www.canva.com/'},
  {cat:'email', name:'Foto 3x4', obs:'Criação de foto 3x4 digital no Canva', price:'R$ 17,00', url:'https://www.canva.com/'},

  // GRÁFICA
  {cat:'grafica', name:'Xerox / Cópia', obs:'Cópia de documentos', price:'R$ 0,50', url:null},
  {cat:'grafica', name:'Impressão P/B (Apenas Frente) [Apostila]', obs:'Impressão preto e branco frente — apostila', price:'R$ 2,50/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Impressão P/B (Frente e Verso) [Apostila]', obs:'Impressão preto e branco frente e verso', price:'R$ 3,50/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Impressão Colorida (Apenas Frente) [Apostila]', obs:'Impressão colorida frente — apostila', price:'R$ 3,00/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Impressão Colorida (Frente e Verso) [Apostila]', obs:'Impressão colorida frente e verso', price:'R$ 4,00/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Papel Cartão', obs:'Impressão em papel cartão', price:'R$ 4,00/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Papel Cartão F/V', obs:'Impressão em papel cartão frente e verso', price:'R$ 6,00/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Fotográfico (Normal ou Adesivo)', obs:'Impressão em papel fotográfico normal ou adesivo', price:'R$ 6,00/und · desc. por qtd', url:null},
  {cat:'grafica', name:'Vinil', obs:'Impressão em vinil', price:'R$ 8,00', url:null},
  {cat:'grafica', name:'Plastificação Pequena', obs:'Plastificação de documento pequeno', price:'R$ 4,00', url:null},
  {cat:'grafica', name:'Plastificação Grande', obs:'Plastificação de documento grande', price:'R$ 6,00', url:null},
  {cat:'grafica', name:'Encadernação', obs:'Encadernação espiral de trabalho/apostila', price:'R$ 10,00', url:null},
  {cat:'grafica', name:'Corte de Material Impresso', obs:'Corte de folhas ou papéis impressos', price:'R$ 1,00 por folha', url:null},
  {cat:'grafica', name:'Consulta Completa', obs:'Consulta para serviços complexos que demandam mais tempo e atenção (use o bom senso)', price:'R$ 4,00', url:null},
  {cat:'grafica', name:'Consulta Básica', obs:'Consulta simples: pesquisar foto, verificar conta aberta, informações básicas (use o bom senso)', price:'R$ 2,00', url:null},

  // ESPECIAIS
  {cat:'especiais', name:'Contracheque Brasília / UFJF (Geraldo)', obs:'Acesso ao sistema SIGEPE para contracheque', price:'R$ 4,75', url:'https://sougov.sigepe.gov.br/sougov/'},
];

// Synonyms for search
const SVC_TAGS = {"IPVA": "ipva boleto carro imposto veiculo renavam guia", "Guia IPVA Parcelado": "ipva parcelado guia boleto renavam carro", "Parcelamento IPVA": "ipva parcelamento carro veiculo debito", "Consulta Veículo": "consulta veiculo carro placa renavam chassi multas restricao", "Imprimir CRLV": "crlv documento carro veiculo rodar renavam placa", "Multas": "multa guia boleto carro veiculo infração transito", "Intenção de Venda": "intencao venda carro veiculo transferencia atpv", "Decalque de Chassi": "decalque chassi carro veiculo transferencia comprador", "Renovação CNH": "renovacao cnh habilitacao carteira motorista", "Agendamento Renovação CNH": "agendamento clinica renovacao cnh habilitacao motorista", "DAE Prova de Legislação": "dae prova legislacao taxa cnh", "Agendamento Prova de Legislação": "agendamento prova legislacao cnh motorista", "Consulta Situação MEI (CCMEI)": "mei ccmei consulta situacao empresa cnpj", "Declaração do MEI (DASN)": "declaracao mei dasn imposto anual cnpj", "NF do MEI": "nota fiscal nf mei nfse cnpj servico", "Guia DAS MEI": "guia das mei boleto mensal imposto cnpj", "Parcelamento MEI": "parcelamento mei debito cnpj empresa", "Abertura MEI": "abertura mei microempreendedor cnpj empresa", "Assinatura GOV (Assinador ITI)": "assinatura eletronica gov iti documento", "Desativar Autenticação 2FA": "desativar 2fa autenticacao dois fatores gov", "Agendamento UAI": "agendamento uai atendimento presencial", "Aumento de Nível GOV": "aumento nivel prata ouro gov facial banco", "Recuperação de Senha GOV": "recuperacao senha gov bronze cpf", "Emissão de Guia de Pagamento (SAL)": "guia pagamento sal receita federal pis pasep nit", "Seguro-Desemprego": "seguro desemprego demissao requerimento beneficio", "Agendamento Perícia INSS": "agendamento pericia inss beneficio exigencia", "Extrato CNIS": "extrato cnis inss declaracao beneficio situacao", "Carteirinha de Pesca": "carteirinha pesca amadora licenca ministerio peixe", "2ª Via CEMIG": "cemig segunda via energia luz conta boleto", "2ª Via CESAMA": "cesama segunda via agua conta boleto matricula", "2ª Via TIM": "tim segunda via conta boleto celular telefone", "2ª Via CLARO": "claro segunda via conta boleto celular telefone", "2ª Via VIVO": "vivo segunda via conta boleto celular telefone", "2ª Via VERO": "vero segunda via conta boleto internet fibra", "2ª Via Velozes (Internet)": "velozes segunda via conta boleto internet", "2ª Via Unimed (JF)": "unimed segunda via plano saude boleto jf", "2ª Via IPTU": "iptu segunda via imposto terreno imovel prefeitura", "2ª Via NIO": "nio segunda via internet whatsapp boleto", "2ª Via de Cartão": "cartao segunda via fatura bradesco nubank banco", "Certidão Civil/Criminal (TRF 1ª Região)": "certidao civil criminal trf 1 regiao federal", "Certidão Civil/Criminal (TRF 6ª Região)": "certidao civil criminal trf 6 regiao federal", "Certidão Cível/Criminal (TJ-MG)": "certidao civel criminal tjmg minas gerais tribunal", "Antecedentes Criminais (Federal)": "antecedentes criminais federal policia dpf", "Antecedentes Criminais (PC-MG)": "antecedentes criminais pcmg policia minas", "Certidão de Quitação Eleitoral": "certidao quitacao eleitoral titulo eleitor", "2ª Via CPF": "segunda via cpf documento federal", "2ª Via Título de Eleitor": "segunda via titulo eleitor documento eleitoral", "Procuração": "procuracao representante poder documento", "Contrato de Compra e Venda": "contrato compra venda imovel veiculo documento", "Contrato de Aluguel Protetivo": "contrato aluguel protetivo locacao imovel", "Contrato de Aluguel Padrão": "contrato aluguel padrao locacao imovel", "Cadastro para Concurso": "cadastro concurso inscricao edital", "Isenção ENEM": "isencao enem inscricao estudante escola", "Atualização de Currículo": "atualizacao curriculo emprego vagas", "Currículo Padrão": "curriculo padrao emprego vagas preto branco", "Currículo Personalizado": "curriculo personalizado emprego vagas colorido foto", "Pesquisa Escolar Simples": "pesquisa escolar trabalho escola simples texto", "Pesquisa Escolar Complexa": "pesquisa escolar trabalho escola complexa imagem", "Formatação de Texto": "formatacao texto word margem ortografia", "Digitação de Texto": "digitacao texto word digitar", "Digitação (Placa)": "digitacao placa banner arte", "Ajuste de Arte": "ajuste arte imagem design grafica", "Criação de E-mail (Gmail)": "criacao email gmail google conta correo eletronico", "Envio de E-mail": "envio email gmail mensagem curriculo empresa", "Foto Polaroid": "foto polaroid impressao fotografica polaroide", "Foto 3x4": "foto 3x4 documento carteira identidade", "Xerox / Cópia": "xerox copia documento impressao", "Impressão Colorida Frente Apostila": "impressao colorida frente apostila pdf folha", "Impressão Colorida Frente e Verso": "impressao colorida frente verso apostila pdf", "Impressão PB Frente Apostila": "impressao preto branco frente apostila pdf", "Impressão PB Frente e Verso": "impressao preto branco frente verso apostila pdf", "Plastificação": "plastificacao documento laminar", "Encadernação": "encadernacao apostila livro espiral", "Corte de Material Impresso": "corte material impresso folha", "Contracheque Brasília / UFJF (Geraldo)": "contracheque brasilia ufjf geraldo salario"};
  const SYNONYMS = {
  'luz':'cemig','energia':'cemig','cemig':'cemig',
  'agua':'cesama','cesama':'cesama',
  'cnh':'renovação cnh','habilitação':'renovação cnh',
  'carro':'veículo','veiculo':'veículo','ipva':'ipva',
  'inss':'inss','previdencia':'inss','aposentadoria':'inss',
  'email':'e-mail','gmail':'e-mail','correio':'e-mail',
  'cpf':'cpf','titulo':'título eleitor','eleitor':'título eleitor',
  'multa':'multas','detran':'detran',
  'certidão':'certidão','certidao':'certidão',
  'curriculo':'currículo','curriculum':'currículo',
  'nota fiscal':'nf do mei','nf':'nf do mei','nfse':'nf do mei',
  'seguro':'seguro-desemprego','desemprego':'seguro-desemprego',
  'foto':'foto','polaroid':'foto polaroid','3x4':'foto 3x4',
  'xerox':'xerox','copia':'cópia','plastificação':'plastificação',
  'contrato':'contrato','aluguel':'aluguel','procuração':'procuração',
  'internet':'vero','vero':'vero','velozes':'velozes','vivo':'vivo','claro':'claro','tim':'tim',
  'iptu':'iptu','unimed':'unimed','plano de saude':'unimed',
  'enem':'enem','concurso':'concurso','inscricao':'inscrição',
  'gov':'gov','assinatura':'assinatura gov',
  'mei':'mei','microempreendedor':'mei',
};

