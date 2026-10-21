const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO modal(project_id, text, extension) VALUES (?, ?, ?)`);

    const modals = [
        [
        1,
        "Tela inicial de autenticação com acesso seguro através de email e senha.",
        ".jpg"
],
        [
        1,
        "Dashboard mobile com acesso rápido aos principais módulos do sistema.",
        ".jpg"
],
        [
        1,
        "Frente de caixa adaptada para dispositivos móveis, permitindo pesquisar produtos por nome, código reduzido ou código de barras.",
        ".jpg"
],
        [
        1,
        "Seleção e cadastro de clientes diretamente durante o processo de venda",
        ".jpg"
],
        [
        1,
        "Cadastro de clientes com informações essenciais e possibilidade de utilização sem CPF.",
        ".jpg"
],
        [
        1,
        "Consulta rápida dos produtos cadastrados com informações de preço, estoque e identificação.",
        ".jpg"
],
        [
        1,
        "Histórico de movimentações do estoque organizado para consulta em dispositivos móveis.",
        ".jpg"
],
        [
        1,
        "Consulta de vendas realizadas e acesso aos respectivos documentos fiscais.",
        ".jpg"
],
        [
        1,
        "Visualização de relatórios de vendas, entradas e saídas do estoque.",
        ".jpg"
],
        [
        1,
        "Módulo de serviços para registrar mão de obra e combinar serviços com produtos na mesma operação.",
        ".jpg"
],
        [
        2,
        "Tela de login com credencias de email e login, email sendo verificado para segurança dos usuários.",
        ".jpg"
],
        [
        2,
        "Frente de caixa com campos de pesquisa para nome, codigo reduzido e codigo de barras. ajuste de filtro, seleção / criação de clientes e edição de produtos em tempo real.",
        ".jpg"
],
        [
        2,
        "Clientes podem ser registrados com ou sem cpf.",
        ".jpg"
],
        [
        2,
        "Sistema equipado com exportação de nota fiscal por PDF ou impressão xml.",
        ".jpg"
],
        [
        2,
        "Exemplo nota fiscal pdf.",
        ".jpg"
],
        [
        2,
        "Seleção de cliente no ato da venda.",
        ".jpg"
],
        [
        2,
        "Crud completo de produtos com campos de pesquisa e ações de edição, exclusão e copiar.",
        ".jpg"
],
        [
        2,
        "Visualização de produto.",
        ".jpg"
],
        [
        2,
        "Botões: adicionar +1 no estoque, remover -1 no estoque, copiar produto, editar produto, excluir produto.",
        ".jpg"
],
        [
        2,
        "Relatorios de entradas, vendas e saidas do estoque - visualização geral de todos os produtos.",
        ".jpg"
],
        [
        2,
        "Visualização de toda movimentação do estoque detalhada.",
        ".jpg"
],
        [
        2,
        "Dados de percentual de lucro para cada produto registrado.",
        ".jpg"
],
        [
        2,
        "Relatórios graficos da movimentação do estoque.",
        ".jpg"
],
        [
        2,
        "Exportação de todo o estoque.",
        ".jpg"
],
        [
        2,
        "Modulo de serviços, alternativa de produtos, adiciona valor da mão de obra + adicionar produtos a soma.",
        ".jpg"
],
        [
        2,
        "Registro de todos os clientes.",
        ".jpg"
],
        [
        2,
        "Configuração do perfil pessoal, configuração do perfil do comercio, configuração de permissões de usuarios + controle de usuarios.",
        ".jpg"
],
        [
        2,
        "menu responsivo com todos os modulos:\\ncaixa - produtos visao geral - produtos estoque - produtos relatorios - serviços visao geral - serviços relatorios - clientes vendas - clientes visao geral",
        ".jpg"
],
        [
        3,
        "Página comercial com home, banner e indexação de links",
        ".jpg"
],
        [
        4,
        "Página comercial com home, banner e indexação de links",
        ".jpg"
],
        [
        5,
        "Página comercial com home, banner e indexação de links",
        ".jpg"
]
    ];

    modals.map((data) => {
        insert.run(...data);
    });
}

module.exports = { modalSeed };
