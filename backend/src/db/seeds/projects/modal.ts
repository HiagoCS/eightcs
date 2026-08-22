const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`INSERT INTO modal(project_id, text, extension) VALUES (?, ?, ?)`);
    const modals = [
        [1, "tela de login com credencias de email e login, email sendo verificado para segurança dos usuários.", ".png"],
        [1, "frente de caixa com campos de pesquisa para nome, codigo reduzido e codigo de barras. ajuste de filtro, seleção / criação de clientes e edição de produtos em tempo real.", ".png"],
        [1, "clientes podem ser registrados com ou sem cpf", ".png"],
        [1, "sistema equipado com exportação de nota fiscal por PDF ou impressão xml", ".png"],
        [1, "exemplo nota fiscal pdf", ".png"],
        [1, "seleção de cliente no ato da venda", ".png"],
        [1, "visualização e exportação de notas fiscais", ".png"],
        [1, "crud completo de produtos com campos de pesquisa e ações de edição, exclusão e copiar.", ".png"],
        [1, "visualização de produto", ".png"],
        [1, "botões: adicionar +1 no estoque, remover -1 no estoque, copiar produto, editar produto, excluir produto.", ".png"],
        [1, "relatorios de entradas, vendas e saidas do estoque - visualização geral de todos os produtos.", ".png"],
        [1, "visualização de toda movimentação do estoque simplificada", ".png"],
        [1, "visualização de toda movimentação do estoque detalhada", ".png"],
        [1, "dados de percentual de lucro para cada produto registrado", ".png"],
        [1, "exportação da movimentação de estoque de cada produto.", ".png"],
        [1, "relatórios graficos da movimentação do estoque.", ".png"],
        [1, "exportação de todo o estoque.", ".png"],
        [1, "modulo de serviços, alternativa de produtos, adiciona valor da mão de obra + adicionar produtos a soma.", ".png"],
        [1, "registro de todos os clientes", ".png"],
        [1, "configuração do perfil pessoal, configuração do perfil do comercio, configuração de permissões de usuarios + controle de usuarios.", ".png"],
        [1, "menu responsivo com todos os modulos:\ncaixa - produtos visao geral - produtos estoque - produtos relatorios - serviços visao geral - serviços relatorios - clientes vendas - clientes visao geral", ".png"],

        [2, "Tela inicial de autenticação com acesso seguro através de email e senha.", ".png"],
        [2, "Dashboard mobile com acesso rápido aos principais módulos do sistema.", ".png"],
        [2, "Frente de caixa adaptada para dispositivos móveis, permitindo pesquisar produtos por nome, código reduzido ou código de barras.", ".png"],
        [2, "Carrinho de venda otimizado para telas menores, com edição de quantidade e remoção de produtos.", ".png"],
        [2, "Seleção e cadastro de clientes diretamente durante o processo de venda", ".png"],
        [2, "Cadastro de clientes com informações essenciais e possibilidade de utilização sem CPF.", ".png"],
        [2, "Consulta rápida dos produtos cadastrados com informações de preço, estoque e identificação.", ".png"],
        [2, "Gerenciamento de estoque com ações rápidas para adicionar ou remover unidades de um produto.", ".png"],
        [2, "Visualização detalhada de produtos com informações comerciais e indicadores de estoque.", ".png"],
        [2, "Histórico de movimentações do estoque organizado para consulta em dispositivos móveis.", ".png"],
        [2, "Consulta de vendas realizadas e acesso aos respectivos documentos fiscais.", ".png"],
        [2, "Visualização de relatórios de vendas, entradas e saídas do estoque.", ".png"],
        [2, "Módulo de serviços para registrar mão de obra e combinar serviços com produtos na mesma operação.", ".png"],
        [2, "Menu lateral responsivo reunindo os módulos de caixa, produtos, estoque, serviços, clientes e relatórios.", ".png"],
        [2, "Interface adaptada para navegação por toque, priorizando ações rápidas e utilização com apenas uma mão.", ".png"]
    ];

    modals.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {modalSeed}