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

ALTER TABLE "SuperShop"."Compra" DROP CONSTRAINT "fk_Compra_Produto";
ALTER TABLE "SuperShop"."Compra" DROP CONSTRAINT "fk_compra_usuario";

ALTER TABLE "SuperShop"."Compra" DROP COLUMN "id_produto";
ALTER TABLE "SuperShop"."Compra" DROP COLUMN "id_usuario";

CREATE TABLE "SuperShop"."Compra_Produto" (
    id_compra INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL DEFAULT 1,
    PRIMARY KEY (id_compra, id_produto),
    FOREIGN KEY (id_compra) REFERENCES "SuperShop"."Compra"(id_compra) ON DELETE CASCADE,
    FOREIGN KEY (id_produto) REFERENCES "SuperShop"."Produto"("idProduto") ON DELETE CASCADE
);

-- POPULATE Produto
INSERT INTO "SuperShop"."Produto" (
  "sku",
  "descricao",
  "valor_custo",
  "valor_venda",
  "estoque_min",
  "estoque_atual",
  "status",
  "Categoria_idCategoria",
  "Fornecedor_idFornecedor",
  "Fornecedor_Pessoa_idPessoa"
) VALUES
('SKU-1001', 'Mouse óptico USB', 15.00, 30.00, 5, 20, 'ativo', 5, 1, 1),
('SKU-1002', 'Teclado ABNT2 com fio', 30.00, 62.00, 4, 15, 'ativo', 5, 1, 1),
('SKU-1003', 'Monitor LED 21.5”', 600.00, 720.00, 2, 8, 'ativo', 6, 1, 1),
('SKU-1004', 'Notebook Core i5 8GB RAM', 4000.00, 5200.00, 1, 5, 'ativo', 5, 1, 1),
('SKU-1005', 'HD Externo 1TB USB 3.0', 300.00, 350.00, 3, 10, 'ativo', 6, 1, 1),
('SKU-1006', 'Headset com microfone', 100.00, 200.00, 3, 12, 'ativo', 6, 1, 1),
('SKU-1007', 'Webcam HD 720p', 100.00, 150.00, 2, 9, 'ativo', 5, 1, 1);


-- Maria updates

ALTER TABLE "SuperShop"."Contas_a_Receber" DROP CONSTRAINT "fk_Contas_a_Receber_Quitacao";

Drop table "Quitacao_Venda" 

CREATE TABLE "SuperShop"."Recebimentos" (
  Venda_idVenda INTEGER NOT NULL,
  metodo_pagamento VARCHAR(50) NOT NULL,
  valor_pago NUMERIC(10, 2) NOT NULL
);