/* ===========================
   ALIANÇA — CART
   =========================== */

// ============ DETAIL MODAL ============
var SVC_LOOKUP = {"IPVA": {"pedir": "RENAVAM", "obs": "Pode juntar tudo num boleto ou pagar apenas a parcela do mês vigente."}, "Guia IPVA Parcelado": {"pedir": "CPF do titular", "obs": "Usado apenas quando o cliente já fez o parcelamento antes e precisa da guia do mês."}, "Parcelamento IPVA": {"pedir": "RENAVAM e CPF (que consta no documento).", "obs": "O pedido é feito na hora, já com a 1ª guia.\n\n NÃO INCLUI multas e licenciamento. Só parcela anos anteriores (ex: se estiver em 2026, só após o IPVA atual vencer totalmente).\n\n Atenção: Agrupa automaticamente todos os veículos em atraso no CPF da pessoa (não tem como parcelar só um carro se ela tiver dois devendo)."}, "Consulta Veículo": {"pedir": "Para IPVA: RENAVAM.\n\nPara Multas/Restrições: RENAVAM, CHASSI, PLACA", "obs": "São sistemas separados, sendo necessárias consultas diferentes."}, "Imprimir CRLV": {"pedir": "RENAVAM, CRV, PLACA e CPF. \n\nCaso de perda do CRV: Conta GOV (nível Prata ou Ouro) do cliente solicitante.", "obs": "Atenção: Se não sair o documento atual, há pendências (Multas, IPVA atrasado ou Processo de alienação não finalizado). \n\nCRV perdido em nome de terceiros: Só é possível resolver passando pela vistoria ou solicitando ao titular do veículo."}, "Multas": {"pedir": "Placa, Chassi, Renavam + conta GOV aberta.", "obs": "Valor fixo R$ 6,00 por multa. Sem desconto progressivo no DETRAN."}, "Intenção de Venda": {"pedir": "Conta do GOV nível PRATA ou OURO; CPF do comprador;\n Hodômetro (Quilometragem que o veículo já andou);\n Valor e data da venda; Endereço.", "obs": "Será emitido a APTV (Documento para assinar e reconhecer firma). \nDepois do procedimento, será feito o comunicado de venda pelo vendedor."}, "Decalque de Chassi": {"pedir": "Placa, RENAVAM, CPF do Comprador e o Recibo (ATPV-e) assinado.", "obs": "Login obrigatório no Gov.br do Comprador.\n Prazo de 30 dias para pagar e fazer a vistoria (evita multa de recibo)."}, "Renovação CNH": {"pedir": "CPF, Data de Nascimento e Data da Primeira Habilitação.", "obs": "Emissão da guia do Estado na hora.\nO agendamento da clínica médica só é feito após o pagamento dessa guia."}, "Agendamento Renovação CNH": {"pedir": "CPF, Data de Nascimento, E-mail e Telefone (WhatsApp).", "obs": "Refere-se ao agendamento ou reagendamento na clínica médica/psicológica. Só deve ser feito após o pagamento da taxa estadual."}, "DAE Prova de Legislação": {"pedir": "Nome do Contribuinte, CPF, Data de Nascimento, Municipio", "obs": "Só da pra agendar após o pagamento da taxa DAE"}, "Agendamento Prova de Legislação": {"pedir": "CPF e Data de Nascimento.", "obs": "O sistema libera o agendamento mediante o pagamento da taxa do exame (Guia DAE). Com as novas regras do Contran, não há mais exigência de 45 horas de curso teórico, podendo o aluno agendar a prova quando se sentir preparado."}, "Consulta Situação MEI (CCMEI)": {"pedir": "Conta GOV.", "obs": "O CCMEI é o comprovante oficial. Serve para o cliente abrir conta bancária PJ, pedir empréstimo ou comprovar que a empresa está ativa."}, "Declaração do MEI (DASN)": {"pedir": "CNPJ e valor exato do faturamento anual.", "obs": "Ver se tem funcionário no CNPJ e se é prestação de serviço ou venda de produto."}, "NF do MEI": {"pedir": "Conta do GOV nível PRATA ou OURO,CNPJ ou CPF do cliente, descrição do serviço/cidade e valor da NF.", "obs": "Atenção: É crucial saber se o serviço foi prestado na sua cidade (ex: Juiz de Fora) ou fora, \npara não errar a tributação no Emissor Nacional. Código padrão 99.01, salvo algumas exceções."}, "Guia DAS MEI": {"pedir": "CNPJ do MEI.", "obs": "Podemos estar enviando a guia por PDF mediante ao pagamento via PIX"}, "SISPAR — Guia de Parcelamento (Dívida Federal)": {"pedir": "CPF ou CNPJ + número de uma parcela já paga.", "obs": "1. Acessar o site SISPAR\n2. Inserir CPF ou CNPJ\n3. Colocar o nº de uma parcela já paga\n4. Selecionar tipo de pagamento: Parcela\n5. Gerar e imprimir a guia"}, "Parcelamento MEI": {"pedir": "Conta do GOV nível PRATA ou OURO e das\ndeclarações do imposto de renda em dia.", "obs": "Entrar com a conta GOV do cliente."}, "Abertura MEI": {"pedir": "Conta do GOV nível PRATA ou OURO.", "obs": "Saindo na hora o comprovante do cadastro e já podendo utilizar o\n CNPJ para exercer a função."}, "Assinatura GOV (Assinador ITI)": {"pedir": "Conta GOV.", "obs": "O cliente valida via código. Após assinar, baixar o arquivo para envio."}, "Desativar Autenticação 2FA": {"pedir": "Conta GOV e Identidade", "obs": "Requer formulário com selfie e fotos do documento. Resposta em até 3-5 dias úteis."}, "Agendamento UAI": {"pedir": "Conta GOV.", "obs": "Confirmar qual agendamento específico o cliente necessita."}, "Aumento de Nível GOV": {"pedir": "CPF", "obs": "Verificar telefone/e-mail cadastrado. Se não tiver acesso, pedir Senha Provisória no INSS (vale 24h). Após recuperar, atualizar dados. A conta volta para o nível Bronze."}, "Recuperação de Senha GOV": {"pedir": "CPF", "obs": "Verificar telefone/e-mail cadastrado. Se não tiver acesso, pedir Senha Provisória no INSS (vale 24h). Após recuperar, atualizar dados. A conta volta para o nível Bronze."}, "Emissão de Guia de Pagamento (SAL)": {"pedir": "NIT/PIS/PASEP, N° do código da contribuição e Data da competência.", "obs": "Inserir as informações no link da Receita."}, "Seguro-Desemprego": {"pedir": "Conta GOV + Requerimento do Seguro-Desemprego (papel recebido na demissão).", "obs": "Colocar o N° do protocolo, confirmar dados e inserir a conta bancária (Agência e Conta) para o cliente receber o valor."}, "Agendamento Perícia INSS": {"pedir": "Conta GOV.", "obs": "O protocolo já está aberto. Acessar para ver os dias liberados (perícia) ou documentos necessários (exigência) e dar continuidade."}, "Alteração Cadastral INSS": {"pedir": "Conta do INSS, documento a ser alterado, comprovante de residência e identidade. Se procurador: procuração + termo de responsabilidade.", "obs": "Acessar Meu INSS com a conta do cliente e realizar a alteração cadastral solicitada."}, "Extrato CNIS": {"pedir": "Conta GOV.", "obs": "Se aparecer o formulário de perguntas GOV (conta desatualizada), acrescenta R$ 5,00 ao valor. NÃO PODE ERRAR AS QUESTÕES — bloqueia o INSS por 24h (conta GOV fica normal, só o INSS trava)."}, "Carteirinha de Pesca": {"pedir": "Conta GOV; Categoria (Embarcada/Desembarcada); Idade/Aposentadoria (Isenção para +65 anos Homem / +60 anos Mulher ou Aposentados); Endereço atualizado; e Questionário rápido de pesca (locais, iscas e se usa hospedagem).", "obs": "Taxa do Governo: R$ 20 (Desembarcada) ou R$ 60 (Embarcada). Pagamento via PIX sai em até 3 dias úteis sem precisar de comprovante. Atenção: Se pagar via boleto, o cliente precisa voltar na loja com o comprovante pago para anexarmos no sistema e liberar a licença."}, "Troca de Titularidade CEMIG": {"pedir": "Contrato de aluguel, Identidade, Selfie segurando o documento, Nº da instalação (está na conta CEMIG) e telefone do cliente.", "obs": "1. Acessar videoatendimento.cemig.com.br\n2. Atendimento Online > PF > Residencial > Troca de Titularidade > Chat\n3. Usar e-mail seuemail@gmail.com\n4. Enviar PDFs dos documentos quando solicitado\n5. Escrever ok se atendente pedir para aguardar\n6. Pedir protocolo ao final"}, "2ª Via CEMIG": {"pedir": "CPF e Nº da instalação.", "obs": "Acesso pelo WhatsApp/Telegram. Impressão extra: + R$ 2,50. Imóvel diferente cobra emissão novamente."}, "2ª Via CESAMA": {"pedir": "Nº da matricula.", "obs": "Apenas acessar o site. Impressão extra: + R$ 2,50. Imóvel diferente cobra emissão novamente."}, "2ª Via TIM": {"pedir": "Nº do celular.", "obs": "Pedir \"recuperação de senha\" no site. A senha chegará por SMS no telefone do cliente. \nAbrir no anonimo pois pode haver bugs"}, "2ª Via CLARO": {"pedir": "Nº do celular ou CPF.", "obs": "Inserir os dados no sistema e responder ao pequeno formulário de validação (ex: nome da mãe, rua)."}, "2ª Via VIVO": {"pedir": "Aplicativo instalado e senha.", "obs": "Acessar fatura e compartilhar. Se precisar recuperar a senha da Vivo, o serviço passa a ser R$ 15,00."}, "2ª Via VERO": {"pedir": "CPF.", "obs": "Testar o modelo \"NOME@2026\" ou \"(inciais do nome)@2026\" como senha antes de pedir recuperação. Recuperação de senha da Vero não é cobrada."}, "2ª Via Velozes (Internet)": {"pedir": "CPF do titular da conta.", "obs": "Colocar o cpf no site e emitir a fatura"}, "2ª Via Unimed (JF)": {"pedir": "CPF do titular (ou CNPJ, se for um plano empresarial).", "obs": "Para exibir o boleto, o site da Unimed exige que você desabilite o bloqueio de \"pop-ups\" do seu navegador. Sem isso, o boleto não abre!"}, "2ª Via IPTU": {"pedir": "Nº da inscrição do imóvel.", "obs": "Confirmar qual parcela será emitida. R$ 6,00 por folha impressa (se separar as parcelas) ou apenas uma taxa se juntar num único boleto"}, "2ª Via NIO": {"pedir": "CPF.", "obs": "Feito pelo WhatsApp da loja, basta inserir o CPF."}, "2ª Via de Cartão": {"pedir": "Celular, app instalado e senha.", "obs": "Acessar o aplicativo do cliente e ir na aba extrato/fatura."}, "Certidão Civil/Criminal (TRF 1ª Região)": {"pedir": "CPF.", "obs": "Emitido na hora se estiver tudo regular"}, "Certidão Civil/Criminal (TRF 6ª Região)": {"pedir": "CPF.", "obs": "Prestar atenção na finalidade do cliente para não escolher o órgão errado."}, "Certidão Cível/Criminal (TJ-MG)": {"pedir": "CPF, Nome, Data de nasc., Nome pai/mãe e nº da Identidade.", "obs": "ATENÇÃO: Usar o e-mail da loja (seuemail@gmail.com). Pegar o código lá e colar inteiro no site para salvar. Não confundir com TRJ."}, "Antecedentes Criminais (Federal)": {"pedir": "CPF, Nome, Data de nasc., Nacionalidade, País/Estado/Município de nasc., Nome pai/mãe, Identidade (com Órgão e Estado emissor).", "obs": "Emitido na hora se estiver tudo regular."}, "Antecedentes Criminais (PC-MG)": {"pedir": "RG ou CPF.", "obs": "Testar os dois (RG e CPF). Se não emitir no site, o cliente deve ir presencialmente à delegacia."}, "Certidão de Quitação Eleitoral": {"pedir": "Nome, Título ou CPF, Data de nasc., Nome do pai e da mãe.", "obs": "Sai na hora se o cadastro estiver regular."}, "2ª Via CPF": {"pedir": "CPF, Nome completo, Data de nasc., Nome da mãe e Título de Eleitor (+18 anos).", "obs": "É possível achar o nº do Título pelo CPF, mas se a pessoa não souber o CPF, não emite."}, "2ª Via Título de Eleitor": {"pedir": "Nº do Título ou CPF, Data de nasc., Nome da mãe e do pai.", "obs": "Se não emitir, pode ser: nome alterado (casamento), erro de digitação anterior ou pendência (cancelado/não votou)."}, "Procuração": {"pedir": "Outorgante: Nome, CPF, RG, nacionalidade e estado civil.\nOutorgado: Nome, nacionalidade,\nestado civil, profissão, RG, CPF e endereço.", "obs": "Definir se os poderes serão plenos ou parciais (especificando situações, como assinaturas judiciais)."}, "Contrato de Compra e Venda": {"pedir": "Nome e CPF (Vendedor e Comprador),\n descrição detalhada do bem (imóvel, terreno ou veículo),\n valor da venda e forma de pagamento.", "obs": "Na descrição, incluir metragem, cômodos ou dados do veículo.\nEspecificar se haverá parcelas, entrada ou trocas."}, "Contrato de Aluguel Protetivo": {"pedir": "Nome e CPF (Locador e Locatário),\n endereço do imóvel, validade do contrato,\n valor do aluguel, data de vencimento\n e se terá caução.", "obs": "Modelo mais robusto e seguro, ideal para garantir a segurança jurídica tanto de quem aluga quanto de quem cede o imóvel."}, "Contrato de Aluguel Padrão": {"pedir": "Nome e CPF (Locador e Locatário),\n endereço do imóvel, validade do contrato,\n valor do aluguel, data de vencimento\n e se terá caução.", "obs": "Modelo com cláusulas básicas protetivas. Ideal para quem busca um contrato mais em conta com todos os benefícios essenciais."}, "Cadastro para Concurso": {"pedir": "Dados dependem do edital. Se precisar digitalizar PDF, cobrar + R$ 1,00 por digitalização.", "obs": "Se o cliente pedir um concurso que vocês não conhecem, pesquisar primeiro: datas, vagas e documentos necessários para orientá-lo."}, "Isenção ENEM": {"pedir": "Conta GOV, nome da escola, data de nascimento, NIS (Opcional) e Cad Único (Opcional).", "obs": "Responder 23 questões (conferir cada página para não ter que voltar). Resultado a partir de 08/05 (a consulta é cobrada à parte)."}, "Atualização de Currículo": {"pedir": "PDF do currículo atual e as novas informações.", "obs": "Usar o site iLovePDF para converter em Word. Se o site travar, abrir na guia anônima do Firefox."}, "Currículo Padrão": {"pedir": "Nome completo, Data de nascimento, Endereço de residencia, Telefones para contato, Escolaridade (ate onde estudou), \nSe tem curso ou CNH", "obs": "Preto e branco, sem foto. Envio em PDF. Aviso: O arquivo não fica salvo no nosso sistema."}, "Currículo Personalizado": {"pedir": "Nome completo, Data de nascimento, Endereço de residencia, Telefones para contato, Escolaridade (ate onde estudou), \nSe tem curso ou CNH", "obs": "Colorido, com foto, modelo mais atual. Envio em PDF. Aviso: O arquivo não fica salvo no sistema."}, "Pesquisa Escolar Simples": {"pedir": "Tema da pesquisa.", "obs": "Até 3 páginas (R$ 2,00 por página extra). Apenas texto. Limite de 1 tema/matéria por trabalho."}, "Pesquisa Escolar Complexa": {"pedir": "Tema da pesquisa.", "obs": "Até 5 páginas com imagens (R$ 2,00 por página extra). Limite de 1 tema/matéria por trabalho"}, "Formatação de Texto": {"pedir": "Arquivo do texto.", "obs": "Até 5 páginas. Inclui ajuste de margem, correção ortográfica e separação título/texto."}, "Digitação de Texto": {"pedir": "Texto para digitar.", "obs": "Até 5 páginas de digitação."}, "Digitação (Placa)": {"pedir": "Informações da placa.", "obs": "Montagem rápida na hora."}, "Ajuste de Arte": {"pedir": "Arquivo da imagem.", "obs": "O cliente não tem direito à arte montada. Se quiser comprar o arquivo, a venda do design é R$ 20,00. Cobra-se por arte diferente."}, "Criação de E-mail (Gmail)": {"pedir": "Nenhum dado prévio (nós criamos o login e senha).", "obs": "Entregar a senha ao cliente. O e-mail novo entra como um extra, não afeta os outros que ele já tem no celular."}, "Envio de E-mail": {"pedir": "Arquivos a serem enviados (cliente manda no WhatsApp da loja).", "obs": "ATENÇÃO: Enviar currículos/assuntos diferentes para empresas diferentes = R$ 7,00 cada.\nEnviar a mesma mensagem para várias empresas juntas = R$ 7,00 no total."}, "Foto Polaroid": {"pedir": "Arquivo da foto.", "obs": "Cabem até 6 fotos na página (se o cliente quiser só 3, o valor é o mesmo). Se passar de 6 fotos, cobrar + R$ 6,00 pela folha extra de papel fotográfico."}, "Foto 3x4": {"pedir": "Tirar foto do cliente na parede branca da loja (ou pedir a foto dele).", "obs": "Vem 6 fotos na cartela.\nO processo é: remover fundo > ajustar para 3x4 > colocar no molde do Canva > imprimir.\nFica pronto em 10-15 min."}, "Xerox / Cópia": {"pedir": "Documento original físico em mãos.", "obs": "Valor unitário. Se o cliente enviar o arquivo pelo celular (WhatsApp/PDF), a cobrança entra na regra de \"Impressão\"."}, "Impressão Colorida Frente Apostila": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Se a apostila for muito grande, marcar a entrega para o dia seguinte ou depois."}, "Impressão Colorida Frente e Verso": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Ideal para apostilas grandes."}, "Impressão PB Frente Apostila": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Se a apostila for muito grande, marcar a entrega para o dia seguinte ou depois."}, "Impressão PB Frente e Verso": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Ideal para apostilas grandes."}, "Plastificação": {"pedir": "Documento para plastificar", "obs": "O corte não vem incluso, é apenas uma cortesia. \nNão fazemos cortes circulares ou que não sejam quadrados/retangulares."}, "Encadernação": {"pedir": "Arquivo impresso ou a imprimir.", "obs": "Limite de 150 a 170 folhas (média de 300 páginas). Se passar desse volume, cobrar uma nova encadernação.\nO valor das folhas é a parte"}, "Corte de Material Impresso": {"pedir": "", "obs": ""}, "Contracheque Brasília / UFJF (Geraldo)": {"pedir": "Conta GOV dele.", "obs": "Acessar o site abaixo entrar no gov, clicar em \n\"Meus Contracheques\" e perguntar a ele de qual mês ele quer."}, "Geraldo - Contracheque Brasilia UFJF": {"pedir": "Conta GOV dele.", "obs": "Acessar o site abaixo entrar no gov, clicar em \n\"Meus Contracheques\" e perguntar a ele de qual mês ele quer."}, "Xerox": {"pedir": "Documento original físico em mãos.", "obs": "Valor unitário. Se o cliente enviar o arquivo pelo celular (WhatsApp/PDF), a cobrança entra na regra de \"Impressão\"."}, "Impressão Colorida (Frente e Verso)": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Ideal para apostilas grandes."}, "Impressão Colorida (Apenas Frente) [Apostila]": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Se a apostila for muito grande, marcar a entrega para o dia seguinte ou depois."}, "Impressão P/B (Frente e Verso) [Apostila]": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Ideal para apostilas grandes."}, "Impressão P/B (Apenas Frente) [Apostila]": {"pedir": "Arquivo em PDF.", "obs": "Contado pelo número de páginas. Se a apostila for muito grande, marcar a entrega para o dia seguinte ou depois."}, "Criação de E-mail": {"pedir": "Nenhum dado prévio (nós criamos o login e senha).", "obs": "Entregar a senha ao cliente. O e-mail novo entra como um extra, não afeta os outros que ele já tem no celular."}, "Digitação (Texto)": {"pedir": "Texto para digitar.", "obs": "Até 5 páginas de digitação."}, "Pesquisa Escolar (Complexa)": {"pedir": "Tema da pesquisa.", "obs": "Até 5 páginas com imagens (R$ 2,00 por página extra). Limite de 1 tema/matéria por trabalho"}, "Pesquisa Escolar (Simples)": {"pedir": "Tema da pesquisa.", "obs": "Até 3 páginas (R$ 2,00 por página extra). Apenas texto. Limite de 1 tema/matéria por trabalho."}, "Solicitação de Isenção ENEM": {"pedir": "Conta GOV, nome da escola, data de nascimento, NIS (Opcional) e Cad Único (Opcional).", "obs": "Responder 23 questões (conferir cada página para não ter que voltar). Resultado a partir de 08/05 (a consulta é cobrada à parte)."}, "Contrato de Aluguel (Protetivo)": {"pedir": "Nome e CPF (Locador e Locatário),\n endereço do imóvel, validade do contrato,\n valor do aluguel, data de vencimento\n e se terá caução.", "obs": "Modelo mais robusto e seguro, ideal para garantir a segurança jurídica tanto de quem aluga quanto de quem cede o imóvel."}, "Contrato de Aluguel (Padrão)": {"pedir": "Nome e CPF (Locador e Locatário),\n endereço do imóvel, validade do contrato,\n valor do aluguel, data de vencimento\n e se terá caução.", "obs": "Modelo com cláusulas básicas protetivas. Ideal para quem busca um contrato mais em conta com todos os benefícios essenciais."}, "Certidão Civil/Criminal (TRJ – 1º Região)": {"pedir": "CPF.", "obs": "Emitido na hora se estiver tudo regular"}, "Certidão Civil/Criminal (TRJ – 6º Região)": {"pedir": "CPF.", "obs": "Prestar atenção na finalidade do cliente para não escolher o órgão errado."}, "Certidão Civil/Criminal (TJ-MG)": {"pedir": "CPF, Nome, Data de nasc., Nome pai/mãe e nº da Identidade.", "obs": "ATENÇÃO: Usar o e-mail da loja (seuemail@gmail.com). Pegar o código lá e colar inteiro no site para salvar. Não confundir com TRJ."}, "Certidão - Quitação Eleitoral": {"pedir": "Nome, Título ou CPF, Data de nasc., Nome do pai e da mãe.", "obs": "Sai na hora se o cadastro estiver regular."}, "2ª Via - CPF": {"pedir": "CPF, Nome completo, Data de nasc., Nome da mãe e Título de Eleitor (+18 anos).", "obs": "É possível achar o nº do Título pelo CPF, mas se a pessoa não souber o CPF, não emite."}, "2ª Via - Título de Eleitor": {"pedir": "Nº do Título ou CPF, Data de nasc., Nome da mãe e do pai.", "obs": "Se não emitir, pode ser: nome alterado (casamento), erro de digitação anterior ou pendência (cancelado/não votou)."}, "2ª Via Unimed (Juiz de Fora)": {"pedir": "CPF do titular (ou CNPJ, se for um plano empresarial).", "obs": "Para exibir o boleto, o site da Unimed exige que você desabilite o bloqueio de \"pop-ups\" do seu navegador. Sem isso, o boleto não abre!"}, "2ª Via de Cartão (Bradesco, Nubank...)": {"pedir": "Celular, app instalado e senha.", "obs": "Acessar o aplicativo do cliente e ir na aba extrato/fatura."}, "Solicitação de Seguro Desemprego": {"pedir": "Conta GOV + Requerimento do Seguro-Desemprego (papel recebido na demissão).", "obs": "Colocar o N° do protocolo, confirmar dados e inserir a conta bancária (Agência e Conta) para o cliente receber o valor."}, "Agendamento de Perícia / Cumprimento de Exigência": {"pedir": "Conta GOV.", "obs": "O protocolo já está aberto. Acessar para ver os dias liberados (perícia) ou documentos necessários (exigência) e dar continuidade."}, "Extrato / CNIS / Situação ou\nDeclaração do Benefício": {"pedir": "Conta GOV.", "obs": "Se pedir o formulário de perguntas, é cobrado R$ XX,00 à parte. NÃO PODE ERRAR AS QUESTÕES, senão bloqueia por 24h (a conta GOV continua normal, só bloqueia o INSS)."}, "Emissão de Carteirinha de Pesca": {"pedir": "Conta GOV; Categoria (Embarcada/Desembarcada); Idade/Aposentadoria (Isenção para +65 anos Homem / +60 anos Mulher ou Aposentados); Endereço atualizado; e Questionário rápido de pesca (locais, iscas e se usa hospedagem).", "obs": "Taxa do Governo: R$ 20 (Desembarcada) ou R$ 60 (Embarcada). Pagamento via PIX sai em até 3 dias úteis sem precisar de comprovante. Atenção: Se pagar via boleto, o cliente precisa voltar na loja com o comprovante pago para anexarmos no sistema e liberar a licença."}, "Assinatura Eletrônica GOV": {"pedir": "Conta GOV.", "obs": "O cliente valida via código. Após assinar, baixar o arquivo para envio."}, "Desativar Verificação de 2 Etapas": {"pedir": "Conta GOV e Identidade", "obs": "Requer formulário com selfie e fotos do documento. Resposta em até 3-5 dias úteis."}, "Agendamento no UAI": {"pedir": "Conta GOV.", "obs": "Confirmar qual agendamento específico o cliente necessita."}, "Recuperação da Senha GOV": {"pedir": "Conta GOV.", "obs": "Preços: R$ 10,00 (só facial); R$ 15,00 (só banco); R$ 20,00 (se for junto com a recuperação da senha)."}, "Consulta da situação (CCMEI)": {"pedir": "Conta GOV.", "obs": "O CCMEI é o comprovante oficial. Serve para o cliente abrir conta bancária PJ, pedir empréstimo ou comprovar que a empresa está ativa."}, "Declaração do MEI": {"pedir": "CNPJ e valor exato do faturamento anual.", "obs": "Ver se tem funcionário no CNPJ e se é prestação de serviço ou venda de produto."}, "Parcelamento do MEI": {"pedir": "Conta do GOV nível PRATA ou OURO e das\ndeclarações do imposto de renda em dia.", "obs": "Entrar com a conta GOV do cliente."}, "Emite a guia do MEI": {"pedir": "CNPJ do MEI.", "obs": "Podemos estar enviando a guia por PDF mediante ao pagamento via PIX"}, "Abertura do MEI": {"pedir": "Conta do GOV nível PRATA ou OURO.", "obs": "Saindo na hora o comprovante do cadastro e já podendo utilizar o\n CNPJ para exercer a função."}, "Emitir DAE para agendar prova de legislação": {"pedir": "Nome do Contribuinte, CPF, Data de Nascimento, Municipio", "obs": "Só da pra agendar após o pagamento da taxa DAE"}, "Agendamento da Prova de Legislação": {"pedir": "CPF e Data de Nascimento.", "obs": "O sistema libera o agendamento mediante o pagamento da taxa do exame (Guia DAE). Com as novas regras do Contran, não há mais exigência de 45 horas de curso teórico, podendo o aluno agendar a prova quando se sentir preparado."}, "Imprime MULTA? (Guia para pagar)": {"pedir": "Placa, Chassi e Renavam\nPrecisa de uma conta GOV aberta", "obs": "Só da para tirar uma multa por vez,\n a primeira é 6 e as subsequentes são 2,50"}, "Faz parcelamento de IPVA?": {"pedir": "RENAVAM e CPF (que consta no documento).", "obs": "O pedido é feito na hora, já com a 1ª guia.\n\n NÃO INCLUI multas e licenciamento. Só parcela anos anteriores (ex: se estiver em 2026, só após o IPVA atual vencer totalmente).\n\n Atenção: Agrupa automaticamente todos os veículos em atraso no CPF da pessoa (não tem como parcelar só um carro se ela tiver dois devendo)."}, "Imprimir CRLV (Documento para rodar)": {"pedir": "RENAVAM, CRV, PLACA e CPF. \n\nCaso de perda do CRV: Conta GOV (nível Prata ou Ouro) do cliente solicitante.", "obs": "Atenção: Se não sair o documento atual, há pendências (Multas, IPVA atrasado ou Processo de alienação não finalizado). \n\nCRV perdido em nome de terceiros: Só é possível resolver passando pela vistoria ou solicitando ao titular do veículo."}, "Consulta de Veículo (Multas, IPVA's, restrições...)": {"pedir": "Para IPVA: RENAVAM.\n\nPara Multas/Restrições: RENAVAM, CHASSI, PLACA", "obs": "São sistemas separados, sendo necessárias consultas diferentes."}, "Imprime Guia de Parcelamento (Já feito)": {"pedir": "CPF do titular", "obs": "Usado apenas quando o cliente já fez o parcelamento antes e precisa da guia do mês."}, "Imprime IPVA? (Guia para pagar)": {"pedir": "RENAVAM", "obs": "Pode juntar tudo num boleto ou pagar apenas a parcela do mês vigente."}, "Intenção de venda de veículo": {"pedir": "Conta do GOV nível PRATA ou OURO; CPF do comprador;\n Hodômetro (Quilometragem que o veículo já andou);\n Valor e data da venda; Endereço.", "obs": "Será emitido a APTV (Documento para assinar e reconhecer firma). \nDepois do procedimento, será feito o comunicado de venda pelo vendedor."}, "Faz renovação da CNH?": {"pedir": "CPF, Data de Nascimento e Data da Primeira Habilitação.", "obs": "Emissão da guia do Estado na hora.\nO agendamento da clínica médica só é feito após o pagamento dessa guia."}, "Agendamento da Renovação (Clínica)": {"pedir": "CPF, Data de Nascimento, E-mail e Telefone (WhatsApp).", "obs": "Refere-se ao agendamento ou reagendamento na clínica médica/psicológica. Só deve ser feito após o pagamento da taxa estadual."}};

function svcStepsHtml(txt) {
  if (!txt || !txt.trim()) return '<p class="svc-plain">Não informado.</p>';
  var lines = txt.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);
  if (!lines.length) return '<p class="svc-plain">Não informado.</p>';
  var h = '<div class="svc-steps">';
  for (var i = 0; i < lines.length; i++) {
    h += '<div class="svc-step"><div class="svc-stepn">' + (i+1) + '</div><div class="svc-stept">' + lines[i] + '</div></div>';
  }
  return h + '</div>';
}

var IMAGENS = {
  'Assinatura GOV (Assinador ITI)': [
    { img: 'imagens/assinaturagov1.png', label: 'Passo 1 — Acesse o serviço no GOV.br e clique em Iniciar' },
    { img: 'imagens/assinaturagov2.png', label: 'Passo 2 — Faça login com seu CPF' },
    { img: 'imagens/assinaturagov3.png', label: 'Passo 3 — Tela de upload — arraste e solte o PDF do cliente' },
    { img: 'imagens/assinaturagov4.png', label: 'Passo 4 — Visualize o documento e clique em Avançar' },
    { img: 'imagens/assinaturagov5.png', label: 'Passo 5 — Clique no documento para posicionar a área da assinatura' },
    { img: 'imagens/assinaturagov6.png', label: 'Passo 6 — Digite o código enviado pelo app GOV.br e clique em Autorizar' },
    { img: 'imagens/assinaturagov7.png', label: 'Passo 7 — Clique em "Baixar arquivo assinado"' }
  ],
  'Troca de Titularidade CEMIG': [
    { img: 'imagens/trocadetitularidadecemig1.jpg', label: 'Passo 1 — Acesse o site da CEMIG e clique em "Atendimento Online"' },
    { img: 'imagens/trocadetitularidadecemig2.png', label: 'Passo 2 — Selecione "Troca de Titularidade" e confirme que tem os documentos' },
    { img: 'imagens/trocadetitularidadecemig3.png', label: 'Passo 3 — Escolha o canal de atendimento: Chat ou Vídeo' },
    { img: 'imagens/trocadetitularidadecemig4.png', label: 'Passo 4 — Preencha o formulário com Nome, E-mail, CPF e Telefone' },
    { img: null, label: 'Passo 5 — Quando chegar sua vez, envie os PDFs digitalizados. Se o atendente disser "Aguarde um momento", responda "ok" para não ser expulso do chat. Ao finalizar, solicite o protocolo do atendimento.' }
  ]
};

function openSvcDetail(name, price, url, linkLabel, isLocal) {
  var d = SVC_LOOKUP[name] || {};
  document.getElementById('svcTitle').textContent = name;
  document.getElementById('svcSub').textContent = price || '';
  var _pList = (typeof PASSOS !== 'undefined' && PASSOS[name]) ? PASSOS[name] : null;
  var _passosHtml = _pList ? '<div class="svc-blk"><div class="svc-lbl" style="display:flex;align-items:center;gap:5px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>Passo a passo</div><ol style="margin:8px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:4px">' + _pList.map(function(p){return '<li style="font-size:13px">'+p+'</li>';}).join('') + '</ol></div>' : '';
  var _imgs = (typeof IMAGENS !== 'undefined' && IMAGENS[name]) ? IMAGENS[name] : null;
  var _carHtml = _imgs ? '<div class="svc-blk"><div class="svc-lbl" style="display:flex;align-items:center;gap:5px"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>Passo a passo visual</div><div class="carousel-wrap" id="carouselWrap"></div></div>' : '';
  document.getElementById('svcBody').innerHTML =
    '<div class="svc-blk"><div class="svc-lbl">O que pedir para o cliente</div>' + svcStepsHtml(d.pedir) + '</div>' +
    '<div class="svc-blk"><div class="svc-lbl">Observações / Passo a passo</div>' + svcStepsHtml(d.obs) + '</div>' +
    _passosHtml +
    _carHtml +
    '<div class="svc-blk"><div class="svc-lbl">Valor cobrado</div><p class="svc-plain">' + (price || 'Consultar internamente') + '</p></div>';

  var foot = '';
  if (isLocal) {
    foot += '<span class="svc-btn svc-btn-local">Arquivo Local no PC</span>';
  } else if (url) {
    foot += '<a class="svc-btn svc-btn-p" href="' + url + '" target="_blank" rel="noopener">' + (linkLabel || 'Acessar Sistema') + '</a>';
  } else {
    foot += '<span class="svc-btn svc-btn-g" style="opacity:.7;cursor:default">Sem link online</span>';
  }
  foot += '<button class="svc-btn svc-btn-g" id="svcBtnFechar">Fechar</button>';
  document.getElementById('svcFoot').innerHTML = foot;
  document.getElementById('svcBtnFechar').onclick = closeSvcDetail;
  document.getElementById('svcOv').classList.add('open');
  if (_imgs) {
    var _ci = 0;
    function _renderCar() {
      var step = _imgs[_ci];
      var imgHtml = step.img
        ? '<img src="' + step.img + '" alt="Passo ' + (_ci+1) + '">'
        : '<div class="carousel-no-img"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity:.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><span>' + step.label + '</span></div>';
      var dotsHtml = _imgs.map(function(_, i){ return '<div class="carousel-dot' + (i===_ci?' active':'') + '"></div>'; }).join('');
      document.getElementById('carouselWrap').innerHTML =
        '<div class="carousel-img-box">' + imgHtml + '</div>' +
        (step.img ? '<div class="carousel-label">' + step.label + '</div>' : '') +
        '<div class="carousel-nav">' +
          '<button class="carousel-btn" id="carPrev" ' + (_ci===0?'disabled':'') + '>&#8592;</button>' +
          '<span class="carousel-counter">Passo ' + (_ci+1) + ' de ' + _imgs.length + '</span>' +
          '<button class="carousel-btn" id="carNext" ' + (_ci===_imgs.length-1?'disabled':'') + '>&#8594;</button>' +
        '</div>' +
        '<div class="carousel-dots">' + dotsHtml + '</div>';
      if (_ci > 0) document.getElementById('carPrev').onclick = function(){ _ci--; _renderCar(); };
      if (_ci < _imgs.length-1) document.getElementById('carNext').onclick = function(){ _ci++; _renderCar(); };
    }
    _renderCar();
  }
}

function closeSvcDetail() {
  document.getElementById('svcOv').classList.remove('open');
}

// Attach close button — runs after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('svcClose').addEventListener('click', closeSvcDetail);
  document.getElementById('svcOv').addEventListener('click', function(e) {
    if (e.target === this) closeSvcDetail();
  });
});

var PASSOS = {
  "Assinatura GOV (Assinador ITI)": [
    "Entrar na conta GOV do cliente em acesso.gov.br",
    "Acessar gov.br/servicos/assinatura-eletronica e clicar em INICIAR",
    "Selecionar o arquivo PDF a ser assinado",
    "Com o arquivo carregado, clicar em Avançar",
    "Posicionar a área de assinatura no documento e clicar em Assinar",
    "Digitar o código enviado ao aplicativo GOV do celular do cliente",
    "Baixar o arquivo assinado digitalmente"
  ],
  "Troca de Titularidade CEMIG": [
    "Acessar videoatendimento.cemig.com.br",
    "Selecionar: Atendimento Online > PF > Residencial > Troca de Titularidade > Chat",
    "Preencher dados usando o e-mail seuemail@gmail.com",
    "Aguardar fila e enviar PDFs dos documentos quando solicitado",
    "Se atendente pedir para aguardar, escrever ok",
    "Pedir o número de protocolo ao final do atendimento"
  ]
};

function buildShareMsg(name, price) {
  var d = (typeof SVC_LOOKUP !== 'undefined' && SVC_LOOKUP[name]) ? SVC_LOOKUP[name] : {};
  var pedir = d.pedir || '';
  var msg = '\uD83C\uDFEA *Aliança Serviços*\n\n';
  msg += '\uD83D\uDCCB *Serviço:* ' + name + '\n';
  msg += '\uD83D\uDCB0 *Valor:* ' + price + '\n';
  if (pedir) msg += '\uD83D\uDCCE *O que precisamos:* ' + pedir + '\n';
  msg += '\nQualquer dúvida, estamos à disposição! \uD83D\uDE0A';
  return msg;
}
function copyMsg(name, price) {
  var msg = buildShareMsg(name, price);
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(msg).then(function(){ showToast('\u2705 Mensagem copiada!'); }).catch(function(){ _fbCopy(msg); });
  } else { _fbCopy(msg); }
}
function _fbCopy(msg) {
  var ta = document.createElement('textarea');
  ta.value = msg; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
  document.body.appendChild(ta); ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast('\u2705 Mensagem copiada!'); } catch(e) { showToast('Erro ao copiar'); }
  document.body.removeChild(ta);
}
function showToast(msg) {
  var t = document.getElementById('_svc_toast');
  if (!t) {
    t = document.createElement('div'); t.id = '_svc_toast';
    t.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:11px 26px;border-radius:999px;font-size:14px;font-weight:500;z-index:99999;opacity:0;transition:opacity .25s;pointer-events:none;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.25)';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._tmr); t._tmr = setTimeout(function(){ t.style.opacity = '0'; }, 2500);
}

//  CAIXA DO DIA — JS

var TIERS = {
  'Xerox P/B':                                           [{n:1,x:Infinity,p:0.50}],
  'Impressão P/B (Apenas Frente) [Apostila]':            [{n:1,x:4,p:2.50},{n:5,x:9,p:2.00},{n:10,x:24,p:1.50},{n:25,x:Infinity,p:0.75}],
  'Impressão P/B (Frente e Verso) [Apostila]':           [{n:1,x:4,p:3.50},{n:5,x:9,p:1.75},{n:10,x:24,p:1.00},{n:25,x:99,p:0.50},{n:100,x:Infinity,p:0.40}],
  'Impressão Colorida (Apenas Frente) [Apostila]':       [{n:1,x:4,p:3.00},{n:5,x:9,p:2.50},{n:10,x:24,p:1.75},{n:25,x:Infinity,p:1.25}],
  'Impressão Colorida (Frente e Verso) [Apostila]':      [{n:1,x:4,p:4.00},{n:5,x:9,p:2.00},{n:10,x:24,p:1.50},{n:25,x:99,p:1.00},{n:100,x:Infinity,p:0.65}],
  'Papel Cartão':                                        [{n:1,x:9,p:4.00},{n:10,x:24,p:3.50},{n:25,x:Infinity,p:3.00}],
  'Papel Cartão F/V':                                    [{n:1,x:9,p:6.00},{n:10,x:24,p:5.00},{n:25,x:Infinity,p:3.50}],
  'Fotográfico (Normal ou Adesivo)':                     [{n:1,x:9,p:6.00},{n:10,x:Infinity,p:5.00}],
  'Vinil':                                               [{n:1,x:Infinity,p:8.00}]
};

var CNIS_KEY = 'Extrato / CNIS / Situação ou Declaração do Benefício';

// estado
var _cart = [];
var _atendimentos = [];
var _atenCount = 0;
var _tab = 'current';

function _tierPrice(name, qty) {
  var ts = TIERS[name]; if (!ts) return null;
  for (var i=0;i<ts.length;i++) if (qty>=ts[i].n && qty<=ts[i].x) return ts[i].p;
  return ts[ts.length-1].p;
}
function _tierLabel(name, qty) {
  var ts = TIERS[name]; if (!ts) return '';
  for (var i=0;i<ts.length;i++) if (qty>=ts[i].n && qty<=ts[i].x) return 'faixa: '+ts[i].n+(ts[i].x===Infinity?'+':'–'+ts[i].x)+' und';
  return '';
}
function _itemTotal(item) {
  if (item.name === CNIS_KEY) return 6.00 + (item.qty - 1) * 0.50;
  var p = _tierPrice(item.name, item.qty);
  if (p !== null) return p * item.qty;
  return item.basePrice * item.qty;
}
function _brl(v) { return 'R$ ' + v.toFixed(2).replace('.',','); }
function _now() { var d=new Date(); return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2); }
function _parsePrice(s) { if(!s) return 0; var m=s.match(/[0-9]+[,.]?[0-9]*/); return m ? parseFloat(m[0].replace(',','.')) : 0; }
// Data ISO LOCAL (YYYY-MM-DD) — evita problema de fuso horário que .toISOString() causa no Brasil
function _todayISO() {
  var d = new Date();
  var y = d.getFullYear();
  var m = ('0' + (d.getMonth() + 1)).slice(-2);
  var dd = ('0' + d.getDate()).slice(-2);
  return y + '-' + m + '-' + dd;
}

function addToCart(name, priceStr) {
  var ex = null;
  for (var i=0;i<_cart.length;i++) { if (_cart[i].name===name){ex=_cart[i];break;} }
  if (ex) { ex.qty++; } else { _cart.push({uid: _cart.length + '_' + Date.now(), name:name, qty:1, basePrice:_parsePrice(priceStr)}); }
  _renderCart(); _renderBadge();
}

// Adiciona produto da Loja (com código) ao carrinho — será baixado do estoque no finishAttendance
function addProductToCart(codigo, nome, preco) {
  var ex = null;
  for (var i=0;i<_cart.length;i++) { if (_cart[i].name===nome){ex=_cart[i];break;} }
  if (ex) { ex.qty++; }
  else { _cart.push({uid: 'p_' + codigo + '_' + Date.now(), name:nome, qty:1, basePrice:Number(preco)||0, productCode: String(codigo)}); }
  _renderCart(); _renderBadge();
}
window.addProductToCart = addProductToCart;
function quickAdd(name, price) { addToCart(name, price); }

function _removeItem(idx) {
  _cart.splice(idx, 1); _renderCart(); _renderBadge();
}
function _changeQty(idx, delta) {
  if (_cart[idx]) { _cart[idx].qty=Math.max(1,_cart[idx].qty+delta); }
  _renderCart(); _renderBadge();
}
function clearCart() {
  if (_cart.length === 0) return;
  if (!confirm('Cancelar atendimento atual?')) return;
  _cart = [];
  _renderCart();
  _renderBadge();
}

async function finishAttendance() {
  if (_cart.length === 0) {
    alert('Nenhum serviço adicionado!');
    return;
  }

  _atenCount++;

  var tot = 0;
  for (var i = 0; i < _cart.length; i++) tot += _itemTotal(_cart[i]);

  var saved = [];
  var produtosVendidos = [];
  for (var i = 0; i < _cart.length; i++) {
    var savedItem = {
      name: _cart[i].name,
      qty: _cart[i].qty,
      tot: _itemTotal(_cart[i])
    };
    if (_cart[i].productCode) {
      savedItem.productCode = _cart[i].productCode;
      produtosVendidos.push({ codigo: _cart[i].productCode, qty: _cart[i].qty });
    }
    saved.push(savedItem);
  }

  var agora = new Date();
  var dataISO = _todayISO();
  var hora = agora.toTimeString().slice(0, 5);

  var at = {
    id: _atenCount,
    time: _now(),
    items: saved,
    total: tot,
    data: dataISO,
    hora: hora,
    _syncStatus: 'saving' // saving | saved | error
  };

  _atendimentos.unshift(at);
  _cart = [];
  _renderCart();
  _renderBadge();
  _switchTab('history');
  _updateDayTotal();

  // Salva no Firestore e aguarda confirmação
  if (window.salvarAtendimento) {
    try {
      await window.salvarAtendimento(at);
      at._syncStatus = 'saved';
    } catch (e) {
      console.error('Falha ao salvar no Firestore:', e);
      at._syncStatus = 'error';
    }
    _renderHistory();
  } else {
    at._syncStatus = 'error';
    _renderHistory();
  }

  // Baixa automática de estoque para produtos vendidos (permite negativo)
  if (produtosVendidos.length > 0 && window.baixaEstoque) {
    for (var p = 0; p < produtosVendidos.length; p++) {
      try {
        await window.baixaEstoque(produtosVendidos[p].codigo, produtosVendidos[p].qty, at.id);
      } catch (e) { console.warn('Falha baixa estoque:', e); }
    }
    // Atualiza loja em background
    if (window._recarregarLoja) { window._recarregarLoja(true); }
  }
}

function _renderCart() {
  var el = document.getElementById('cartItems');
  if (!el) return;

  var tot = document.getElementById('cartTotal');
  var tc = document.getElementById('tabCurrentCount');
  if (tc) tc.textContent = _cart.length;

  if (_cart.length === 0) {
    el.innerHTML = '<div class="cart-empty"><span>Nenhum serviço adicionado</span></div>';
    if (tot) tot.textContent = 'R$ 0,00';
    return;
  }

  var sum = 0, out = '';
  for (var i = 0; i < _cart.length; i++) {
    var it = _cart[i], vt = _itemTotal(it); sum += vt;
    var isCnis = (it.name === CNIS_KEY), hasTier = !!TIERS[it.name];
    out += '<div class="cart-item">' +
      '<div class="cart-item-top"><span class="cart-item-name">' + it.name + '</span>' +
        '<button class="cart-item-remove" onclick="_removeItem(' + i + ')">&#x2715;</button></div>' +
      '<div class="cart-item-bottom">' +
        '<div class="cart-qty">' +
          '<button class="cart-qty-btn" onclick="_changeQty(' + i + ',-1)">&#x2212;</button>' +
          '<span class="cart-qty-val">' + it.qty + '</span>' +
          '<button class="cart-qty-btn" onclick="_changeQty(' + i + ',1)">+</button>' +
        '</div>';
    if (isCnis) out += '<span class="cart-item-tier">' + it.qty + ' pág.</span>';
    else if (hasTier) out += '<span class="cart-item-tier">' + _tierLabel(it.name, it.qty) + '</span>';
    out += '<span class="cart-item-price">' + _brl(vt) + '</span>';
    out += '</div></div>';
  }

  el.innerHTML = out;
  if (tot) tot.textContent = _brl(sum);
}

function copyCart() {
  if (_cart.length === 0) {
    alert('Carrinho vazio!');
    return;
  }
  var tot = 0;
  for (var i = 0; i < _cart.length; i++) tot += _itemTotal(_cart[i]);
  var lines = ['Resumo do Atendimento'];
  for (var i = 0; i < _cart.length; i++) {
    var it = _cart[i];
    lines.push('- ' + it.name + (it.qty > 1 ? ' (x' + it.qty + ')' : '') + ' — ' + _brl(_itemTotal(it)));
  }
  lines.push('Total: ' + _brl(tot));
  navigator.clipboard.writeText(lines.join('\n')).then(function () {
    var b = document.querySelector('.cart-btn-copy');
    if (!b) return;
    var o = b.innerHTML;
    b.textContent = '✓';
    setTimeout(function () { b.innerHTML = o; }, 1800);
  });
}

// NÃO DEVE ter nenhum "});" aqui
// Próxima função logo em seguida:

function _copyAten(idx) {
  var h = _atendimentos[idx];
  var lines = ['Resumo do Atendimento #' + h.id + ' (' + h.time + ')'];
  for (var i = 0; i < h.items.length; i++) {
    var it = h.items[i];
    lines.push('- ' + it.name + (it.qty > 1 ? ' (x' + it.qty + ')' : '') + ' — ' + _brl(it.tot));
  }
  lines.push('Total: ' + _brl(h.total));
  navigator.clipboard.writeText(lines.join('\n')).then(function () {
    var btns = document.querySelectorAll('.hist-item-copy');
    if (btns[idx]) {
      var o = btns[idx].textContent;
      btns[idx].textContent = '✓ Copiado!';
      setTimeout(function () { btns[idx].textContent = o; }, 1800);
    }
  });
}

async function _deleteAten(idx) {
  var h = _atendimentos[idx];
  if (!h) return;
  var labelId = (h.id != null) ? h.id : (idx + 1);
  if (!confirm('Cancelar / excluir Atendimento #' + labelId + ' (' + _brl(h.total) + ')?\n\nIsso vai apagar do site E do banco de dados Firebase.\nEssa ação não pode ser desfeita.')) return;

  // Se ainda está salvando, espera um pouco
  if (h._syncStatus === 'saving') {
    var waited = 0;
    while (h._syncStatus === 'saving' && waited < 5000) {
      await new Promise(function(r){ setTimeout(r, 200); });
      waited += 200;
    }
  }

  // Marca como excluindo (feedback visual)
  h._syncStatus = 'deleting';
  _renderHistory();

  // Tenta excluir do Firestore PRIMEIRO
  if (h._docId && typeof h._docId === "string" && window.excluirAtendimento) {
    try {
      await window.excluirAtendimento(h._docId);
      console.log("Apagado do Firestore:", h._docId);
    } catch (e) {
      console.error("Erro ao excluir no Firestore:", e);
      h._syncStatus = 'error';
      _renderHistory();
      alert('Erro ao excluir do Firebase. O atendimento NÃO foi removido.\n\nVerifique sua conexão e tente novamente.\n\nDetalhe: ' + (e && e.message ? e.message : e));
      return;
    }
  } else if (!h._docId) {
    // Não tem _docId — nunca foi salvo (talvez offline). Permite excluir só local.
    console.warn('Atendimento sem _docId — removendo apenas localmente.');
  }

  // Só remove local depois de confirmado no Firestore (ou se nunca foi salvo)
  _atendimentos.splice(idx, 1);
  _renderHistory();
  _renderBadge();
  _updateDayTotal();
}

// Retorna apenas os atendimentos do dia atual (filtra fora os de outros dias)
function _atendimentosDoDia() {
  var hoje = _todayISO();
  var lista = [];
  for (var i = 0; i < _atendimentos.length; i++) {
    var a = _atendimentos[i];
    // Se não tem data, considera de hoje (compat. com itens antigos)
    if (!a.data || a.data === hoje) lista.push({ _origIdx: i, item: a });
  }
  return lista;
}

function _renderHistory() {
  var el = document.getElementById('histItems');
  if (!el) return;

  var visiveis = _atendimentosDoDia();

  var tc = document.getElementById('tabHistCount');
  if (tc) tc.textContent = visiveis.length;

  if (visiveis.length === 0) {
    el.innerHTML = '<div class="cart-empty" style="margin-top:40px"><span>Nenhum atendimento finalizado hoje</span></div>';
    return;
  }

  var out = '';
  for (var v = 0; v < visiveis.length; v++) {
    var h = visiveis[v].item;
    var realIdx = visiveis[v]._origIdx; // índice em _atendimentos (para passar nos onclicks)
    var labelId = (h.id != null) ? h.id : (realIdx + 1);

    var lines = '';
    for (var j = 0; j < h.items.length; j++) {
      var it = h.items[j];
      lines += (j > 0 ? '<br>' : '') +
        (it.qty > 1 ? it.qty + 'x ' : '') +
        it.name + ' — ' + _brl(it.tot);
    }

    // Indicador visual de status de sincronização
    var syncBadge = '';
    if (h._syncStatus === 'saving') {
      syncBadge = '<span title="Salvando no Firebase..." style="font-size:10px;color:#b08a3a;background:#fff8e6;padding:1px 6px;border-radius:8px;font-weight:700">⏳ salvando</span>';
    } else if (h._syncStatus === 'deleting') {
      syncBadge = '<span title="Excluindo do Firebase..." style="font-size:10px;color:#a12c7b;background:#fde6f3;padding:1px 6px;border-radius:8px;font-weight:700">⏳ excluindo</span>';
    } else if (h._syncStatus === 'error') {
      syncBadge = '<span title="Erro de sincronização" style="font-size:10px;color:#a12c7b;background:#fde6f3;padding:1px 6px;border-radius:8px;font-weight:700">⚠ erro</span>';
    } else if (h._docId) {
      syncBadge = '<span title="Salvo no Firebase" style="font-size:10px;color:#437a22;background:#e9f3df;padding:1px 6px;border-radius:8px;font-weight:700">✓ salvo</span>';
    }

    out += '<div class="hist-item">' +
      '<div class="hist-item-head">' +
        '<span class="hist-item-label">Atendimento #' + labelId + '</span>' +
        '<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:flex-end">' +
          syncBadge +
          '<span class="hist-item-time">' + (h.time || '') + '</span>' +
          '<button onclick="_deleteAten(' + realIdx + ')" title="Cancelar venda (apaga do site e do Firebase)" style="background:none;border:none;cursor:pointer;color:#888;font-size:14px;padding:2px 5px;border-radius:4px">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="hist-item-lines">' + lines + '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;gap:6px;flex-wrap:wrap">' +
        '<span class="hist-item-total">' + _brl(h.total) + '</span>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
          '<button class="hist-item-copy" onclick="_copyAten(' + realIdx + ')">Copiar</button>' +
          '<button onclick="gerarNotinha(' + realIdx + ')" class="btn-notinha">🧾 Notinha</button>' +
          '<button onclick="_deleteAten(' + realIdx + ')" title="Cancelar venda" style="padding:5px 10px;border-radius:6px;background:#fee2e2;color:#a12c7b;border:1px solid #f5b8c8;cursor:pointer;font-size:11px;font-weight:700">✕ Cancelar</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }
  el.innerHTML = out;
}

function _renderBadge() {
  var b=document.getElementById('cartBadge'); if(!b) return;
  b.textContent=_cart.length;
  if(_cart.length>0) b.classList.add('show'); else b.classList.remove('show');
}

function _switchTab(tab) {
  _tab=tab;
  var tc=document.getElementById('tabCurrent'), th=document.getElementById('tabHistory');
  var pc=document.getElementById('panelCurrent'), ph=document.getElementById('panelHistory');
  if(!tc||!th||!pc||!ph) return;
  if(tab==='current'){
    tc.classList.add('active'); th.classList.remove('active');
    pc.style.display='flex'; ph.style.display='none';
  } else {
    th.classList.add('active'); tc.classList.remove('active');
    ph.style.display='flex'; ph.style.flexDirection='column'; pc.style.display='none';
    _renderHistory();
    _updateDayTotal();
  }
}

