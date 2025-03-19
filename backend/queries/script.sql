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