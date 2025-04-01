-- ***********************/ SCRIPT DE CRIAÇÃO/ALTERAÇÕES DE TABELAS /***********************

-- Garante que novas tabelas tenham permission public para insert, select, update e delete 
ALTER DEFAULT PRIVILEGES IN SCHEMA "SuperShop"
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO PUBLIC;

-- COMISSAO
ALTER TABLE "SuperShop"."Comissao" ADD COLUMN descricao VARCHAR(255);

-- DESPESAS
ALTER TABLE "SuperShop"."Despesa" ADD COLUMN data_pagamento DATE DEFAULT NULL;
ALTER TABLE "SuperShop"."Despesa" ALTER COLUMN "valor" TYPE DECIMAL(10,2) USING "valor"::DECIMAL(10,2);
ALTER TABLE "SuperShop"."Despesa" DROP CONSTRAINT IF EXISTS chk_valor_positivo;

-- POPULATE TipoDespesa
INSERT INTO "SuperShop"."TipoDespesa" (nome_tipo, descricao_tipo) 
VALUES 
('Aluguel', 'Despesa referente ao pagamento do aluguel do estabelecimento'),
('Energia', 'Despesa com conta de energia elétrica'),
('Internet', 'Despesa com serviço de internet e telecomunicações'),
('Material de Escritório', 'Compra de suprimentos para o escritório'),
('Manutenção', 'Custos com reparos e manutenção de equipamentos e estrutura');

-- POPULATE Despesa
INSERT INTO "SuperShop"."Despesa" (
    dt_despesa, dt_vencimento, valor, metodo_pgmto, descricao, status, "Tipo_idTipo", data_pagamento
) VALUES
    ('2024-03-01', '2024-03-10', 250.00, 'Boleto', 'Conta de luz', 'Pendente', 2, NULL), -- PRESTAR ATENÇÃO NO SERIAL DO ID Tipo_idTipo DO SEU BANCO! 
    ('2024-03-05', '2024-03-15', 120.50, 'Cartão', 'Conta de água', 'Pendente', 5, NULL),
    ('2024-03-08', '2024-03-20', 500.00, 'Dinheiro', 'Aluguel apartamento', 'Pendente', 1, NULL),
    ('2024-03-10', '2024-03-25', 75.90, 'Pix', 'Internet - Vivo', 'Pendente', 3, NULL),
    ('2024-03-12', '2024-03-30', 200.00, 'Dinheiro', 'Concerto ar-condicionado', 'Pendente', 5, NULL),
    ('2024-03-15', '2024-03-28', 500.00, 'Cartão', 'Mesa de Escritório', 'Pendente', 4, NULL),
    ('2024-03-18', '2024-04-05', 300.00, 'Boleto', 'Internet - Claro', 'Pendente', 3, NULL);


-- ALTER Compra
ALTER TABLE "SuperShop"."Usuario" ADD CONSTRAINT unique_idUsuario UNIQUE ("idUsuario");
ALTER TABLE "SuperShop"."Compra" DROP CONSTRAINT "fk_Compra_Fornecedor"
ALTER TABLE "SuperShop"."Compra" DROP CONSTRAINT "fk_Compra_Usuario"
ALTER TABLE "SuperShop"."Compra" DROP CONSTRAINT fk_compra_usuario;

ALTER TABLE "SuperShop"."Compra"
ADD CONSTRAINT fk_Compra_Usuario
FOREIGN KEY ("Usuario_idUsuario")
REFERENCES "SuperShop"."Usuario"("idUsuario")
ON DELETE CASCADE;

ALTER TABLE "SuperShop"."Compra" ALTER COLUMN "total_compra" TYPE DECIMAL(10,2) USING "total_compra"::DECIMAL(10,2);
ALTER TABLE "SuperShop"."Compra" ALTER COLUMN "desconto" TYPE DECIMAL(10,2) USING "desconto"::DECIMAL(10,2);

ALTER TABLE "SuperShop"."Compra" DROP COLUMN "Usuario_Pessoa_idPessoa";
ALTER TABLE "SuperShop"."Compra" DROP COLUMN "Fornecedor_Pessoa_idPessoa";
ALTER TABLE "SuperShop"."Compra" DROP COLUMN "Fornecedor_idFornecedor";

ALTER TABLE "SuperShop"."Compra" RENAME COLUMN "idCompra" TO "id_compra";
ALTER TABLE "SuperShop"."Compra" RENAME COLUMN "idProduto" TO "id_produto";
ALTER TABLE "SuperShop"."Compra" RENAME COLUMN "idUsuario" TO "id_usuario";