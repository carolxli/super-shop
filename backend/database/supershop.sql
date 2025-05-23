PGDMP                       }         	   SuperShop    14.13 (Homebrew)    16.4 �    B           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            C           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            D           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            E           1262    17254 	   SuperShop    DATABASE     m   CREATE DATABASE "SuperShop" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C';
    DROP DATABASE "SuperShop";
                postgres    false                        2615    17255 	   SuperShop    SCHEMA        CREATE SCHEMA "SuperShop";
    DROP SCHEMA "SuperShop";
                postgres    false            �            1259    17295 	   Categoria    TABLE     v   CREATE TABLE "SuperShop"."Categoria" (
    "idCategoria" integer NOT NULL,
    nome character varying(45) NOT NULL
);
 $   DROP TABLE "SuperShop"."Categoria";
    	   SuperShop         heap    postgres    false    6            �            1259    17294    Categoria_idCategoria_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Categoria_idCategoria_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE "SuperShop"."Categoria_idCategoria_seq";
    	   SuperShop          postgres    false    6    217            F           0    0    Categoria_idCategoria_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE "SuperShop"."Categoria_idCategoria_seq" OWNED BY "SuperShop"."Categoria"."idCategoria";
       	   SuperShop          postgres    false    216            �            1259    17342    Cliente    TABLE       CREATE TABLE "SuperShop"."Cliente" (
    "idCliente" integer NOT NULL,
    "Pessoa_idPessoa" integer NOT NULL,
    cpf character varying(45) NOT NULL,
    rg character varying(45) NOT NULL,
    voucher double precision,
    "Historico_Consumo_idHistorico_Consumo" integer
);
 "   DROP TABLE "SuperShop"."Cliente";
    	   SuperShop         heap    postgres    false    6            �            1259    17341    Cliente_idCliente_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Cliente_idCliente_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE "SuperShop"."Cliente_idCliente_seq";
    	   SuperShop          postgres    false    6    225            G           0    0    Cliente_idCliente_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE "SuperShop"."Cliente_idCliente_seq" OWNED BY "SuperShop"."Cliente"."idCliente";
       	   SuperShop          postgres    false    224            �            1259    17304    Comissao    TABLE     �   CREATE TABLE "SuperShop"."Comissao" (
    "idComissao" integer NOT NULL,
    mes integer NOT NULL,
    ano integer NOT NULL,
    valor double precision NOT NULL
);
 #   DROP TABLE "SuperShop"."Comissao";
    	   SuperShop         heap    postgres    false    6            �            1259    17303    Comissao_idComissao_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Comissao_idComissao_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE "SuperShop"."Comissao_idComissao_seq";
    	   SuperShop          postgres    false    6    219            H           0    0    Comissao_idComissao_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE "SuperShop"."Comissao_idComissao_seq" OWNED BY "SuperShop"."Comissao"."idComissao";
       	   SuperShop          postgres    false    218            �            1259    17373    Compra    TABLE     �  CREATE TABLE "SuperShop"."Compra" (
    "idCompra" integer NOT NULL,
    "Fornecedor_idFornecedor" integer NOT NULL,
    "Fornecedor_Pessoa_idPessoa" integer NOT NULL,
    "Produto_idProduto" integer NOT NULL,
    "Usuario_idUsuario" integer NOT NULL,
    "Usuario_Pessoa_idPessoa" integer NOT NULL,
    dt_compra date NOT NULL,
    total_compra double precision NOT NULL,
    desconto double precision,
    metodo_pgmto character varying(45) NOT NULL
);
 !   DROP TABLE "SuperShop"."Compra";
    	   SuperShop         heap    postgres    false    6            �            1259    17372    Compra_idCompra_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Compra_idCompra_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE "SuperShop"."Compra_idCompra_seq";
    	   SuperShop          postgres    false    6    229            I           0    0    Compra_idCompra_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE "SuperShop"."Compra_idCompra_seq" OWNED BY "SuperShop"."Compra"."idCompra";
       	   SuperShop          postgres    false    228            �            1259    17487    Contas_a_Pagar    TABLE     ]  CREATE TABLE "SuperShop"."Contas_a_Pagar" (
    "idContas_a_Pagar" integer NOT NULL,
    numero_parcela integer NOT NULL,
    data_vencimento date NOT NULL,
    valor_parcela double precision NOT NULL,
    status character varying(45) NOT NULL,
    "Quitacao_Despesa_idQuitacao_Despesa" integer NOT NULL,
    "Despesa_idDespesa" integer NOT NULL
);
 )   DROP TABLE "SuperShop"."Contas_a_Pagar";
    	   SuperShop         heap    postgres    false    6            �            1259    17486 #   Contas_a_Pagar_idContas_a_Pagar_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Contas_a_Pagar_idContas_a_Pagar_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 A   DROP SEQUENCE "SuperShop"."Contas_a_Pagar_idContas_a_Pagar_seq";
    	   SuperShop          postgres    false    244    6            J           0    0 #   Contas_a_Pagar_idContas_a_Pagar_seq    SEQUENCE OWNED BY     {   ALTER SEQUENCE "SuperShop"."Contas_a_Pagar_idContas_a_Pagar_seq" OWNED BY "SuperShop"."Contas_a_Pagar"."idContas_a_Pagar";
       	   SuperShop          postgres    false    243            �            1259    17451    Contas_a_Receber    TABLE     M  CREATE TABLE "SuperShop"."Contas_a_Receber" (
    "idContas_a_Receber" integer NOT NULL,
    numero_parcela integer NOT NULL,
    data_vencimento date NOT NULL,
    valor_parcela double precision NOT NULL,
    status character varying(15) NOT NULL,
    "Venda_idVenda" integer NOT NULL,
    "Quitacao_idQuitacao" integer NOT NULL
);
 +   DROP TABLE "SuperShop"."Contas_a_Receber";
    	   SuperShop         heap    postgres    false    6            �            1259    17450 '   Contas_a_Receber_idContas_a_Receber_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Contas_a_Receber_idContas_a_Receber_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 E   DROP SEQUENCE "SuperShop"."Contas_a_Receber_idContas_a_Receber_seq";
    	   SuperShop          postgres    false    238    6            K           0    0 '   Contas_a_Receber_idContas_a_Receber_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE "SuperShop"."Contas_a_Receber_idContas_a_Receber_seq" OWNED BY "SuperShop"."Contas_a_Receber"."idContas_a_Receber";
       	   SuperShop          postgres    false    237            �            1259    17468    Despesa    TABLE     �  CREATE TABLE "SuperShop"."Despesa" (
    "idDespesa" integer NOT NULL,
    dt_despesa date NOT NULL,
    dt_vencimento date,
    valor double precision NOT NULL,
    metodo_pgmto character varying(45) NOT NULL,
    descricao character varying(255) NOT NULL,
    status character varying(45) NOT NULL,
    "Tipo_idTipo" integer,
    CONSTRAINT chk_metodo_pgmto CHECK (((metodo_pgmto)::text = ANY ((ARRAY['Cartão'::character varying, 'Dinheiro'::character varying, 'Pix'::character varying, 'Cartão de Crédito'::character varying, 'Boleto'::character varying])::text[]))),
    CONSTRAINT chk_valor_positivo CHECK ((valor > (0)::double precision))
);
 "   DROP TABLE "SuperShop"."Despesa";
    	   SuperShop         heap    postgres    false    6            �            1259    17467    Despesa_idDespesa_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Despesa_idDespesa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE "SuperShop"."Despesa_idDespesa_seq";
    	   SuperShop          postgres    false    6    240            L           0    0    Despesa_idDespesa_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE "SuperShop"."Despesa_idDespesa_seq" OWNED BY "SuperShop"."Despesa"."idDespesa";
       	   SuperShop          postgres    false    239            �            1259    17504 	   Devolucao    TABLE     \  CREATE TABLE "SuperShop"."Devolucao" (
    "idDevolucao" integer NOT NULL,
    dt_devolucao date NOT NULL,
    motivo character varying(45) NOT NULL,
    "Itens_Vendas_Venda_idVenda" integer NOT NULL,
    "Itens_Vendas_Produto_idProduto" integer NOT NULL,
    "Cliente_idCliente" integer NOT NULL,
    "Cliente_Pessoa_idPessoa" integer NOT NULL
);
 $   DROP TABLE "SuperShop"."Devolucao";
    	   SuperShop         heap    postgres    false    6            �            1259    17503    Devolucao_idDevolucao_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Devolucao_idDevolucao_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE "SuperShop"."Devolucao_idDevolucao_seq";
    	   SuperShop          postgres    false    246    6            M           0    0    Devolucao_idDevolucao_seq    SEQUENCE OWNED BY     g   ALTER SEQUENCE "SuperShop"."Devolucao_idDevolucao_seq" OWNED BY "SuperShop"."Devolucao"."idDevolucao";
       	   SuperShop          postgres    false    245            �            1259    17311 
   Fornecedor    TABLE     �  CREATE TABLE "SuperShop"."Fornecedor" (
    "idFornecedor" integer NOT NULL,
    cnpj character varying(20) NOT NULL,
    razao_social character varying(45) NOT NULL,
    qtd_min_pedido integer NOT NULL,
    prazo_entrega integer NOT NULL,
    dt_inicio_fornecimento date NOT NULL,
    observacao character varying(300),
    "Pessoa_idPessoa" integer NOT NULL,
    "Marca_idMarca" integer NOT NULL
);
 %   DROP TABLE "SuperShop"."Fornecedor";
    	   SuperShop         heap    postgres    false    6            �            1259    17310    Fornecedor_idFornecedor_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Fornecedor_idFornecedor_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE "SuperShop"."Fornecedor_idFornecedor_seq";
    	   SuperShop          postgres    false    221    6            N           0    0    Fornecedor_idFornecedor_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE "SuperShop"."Fornecedor_idFornecedor_seq" OWNED BY "SuperShop"."Fornecedor"."idFornecedor";
       	   SuperShop          postgres    false    220            �            1259    17268    Historico_Consumo    TABLE     q   CREATE TABLE "SuperShop"."Historico_Consumo" (
    "idHistorico_Consumo" integer NOT NULL,
    historico text
);
 ,   DROP TABLE "SuperShop"."Historico_Consumo";
    	   SuperShop         heap    postgres    false    6            �            1259    17267 )   Historico_Consumo_idHistorico_Consumo_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Historico_Consumo_idHistorico_Consumo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 G   DROP SEQUENCE "SuperShop"."Historico_Consumo_idHistorico_Consumo_seq";
    	   SuperShop          postgres    false    6    213            O           0    0 )   Historico_Consumo_idHistorico_Consumo_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE "SuperShop"."Historico_Consumo_idHistorico_Consumo_seq" OWNED BY "SuperShop"."Historico_Consumo"."idHistorico_Consumo";
       	   SuperShop          postgres    false    212            �            1259    17521    Historico_Venda    TABLE     �   CREATE TABLE "SuperShop"."Historico_Venda" (
    "idHistorico_Venda" integer NOT NULL,
    "Venda_idVenda" integer NOT NULL,
    data_hora timestamp without time zone NOT NULL,
    acao character varying(100) NOT NULL
);
 *   DROP TABLE "SuperShop"."Historico_Venda";
    	   SuperShop         heap    postgres    false    6            �            1259    17520 %   Historico_Venda_idHistorico_Venda_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Historico_Venda_idHistorico_Venda_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE "SuperShop"."Historico_Venda_idHistorico_Venda_seq";
    	   SuperShop          postgres    false    6    248            P           0    0 %   Historico_Venda_idHistorico_Venda_seq    SEQUENCE OWNED BY        ALTER SEQUENCE "SuperShop"."Historico_Venda_idHistorico_Venda_seq" OWNED BY "SuperShop"."Historico_Venda"."idHistorico_Venda";
       	   SuperShop          postgres    false    247            �            1259    17428    Itens_Vendas    TABLE     �   CREATE TABLE "SuperShop"."Itens_Vendas" (
    "Venda_idVenda" integer NOT NULL,
    "Produto_idProduto" integer NOT NULL,
    qtde integer NOT NULL,
    valor_unitario double precision NOT NULL
);
 '   DROP TABLE "SuperShop"."Itens_Vendas";
    	   SuperShop         heap    postgres    false    6            �            1259    17277    Marca    TABLE     �   CREATE TABLE "SuperShop"."Marca" (
    "idMarca" integer NOT NULL,
    nome character varying(45) NOT NULL,
    descricao character varying(100)
);
     DROP TABLE "SuperShop"."Marca";
    	   SuperShop         heap    postgres    false    6            �            1259    17276    Marca_idMarca_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Marca_idMarca_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE "SuperShop"."Marca_idMarca_seq";
    	   SuperShop          postgres    false    215    6            Q           0    0    Marca_idMarca_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE "SuperShop"."Marca_idMarca_seq" OWNED BY "SuperShop"."Marca"."idMarca";
       	   SuperShop          postgres    false    214            �            1259    17257    Pessoa    TABLE     4  CREATE TABLE "SuperShop"."Pessoa" (
    "idPessoa" integer NOT NULL,
    email character varying(100) NOT NULL,
    nome character varying(100) NOT NULL,
    end_rua character varying(100) NOT NULL,
    end_numero integer NOT NULL,
    end_bairro character varying(45) NOT NULL,
    end_complemento character varying(50),
    cidade character varying(45) NOT NULL,
    estado character varying(45) NOT NULL,
    cep character varying(20) NOT NULL,
    telefone_1 character varying(15) NOT NULL,
    telefone_2 character varying(15),
    data_nasc date NOT NULL
);
 !   DROP TABLE "SuperShop"."Pessoa";
    	   SuperShop         heap    postgres    false    6            �            1259    17256    Pessoa_idPessoa_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Pessoa_idPessoa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE "SuperShop"."Pessoa_idPessoa_seq";
    	   SuperShop          postgres    false    211    6            R           0    0    Pessoa_idPessoa_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE "SuperShop"."Pessoa_idPessoa_seq" OWNED BY "SuperShop"."Pessoa"."idPessoa";
       	   SuperShop          postgres    false    210            �            1259    17354    Produto    TABLE     �  CREATE TABLE "SuperShop"."Produto" (
    "idProduto" integer NOT NULL,
    sku character varying(45) NOT NULL,
    descricao character varying(150) NOT NULL,
    valor_custo double precision NOT NULL,
    valor_venda double precision NOT NULL,
    estoque_min integer NOT NULL,
    estoque_atual integer NOT NULL,
    status character varying(15) NOT NULL,
    "Categoria_idCategoria" integer NOT NULL,
    "Fornecedor_idFornecedor" integer NOT NULL,
    "Fornecedor_Pessoa_idPessoa" integer NOT NULL
);
 "   DROP TABLE "SuperShop"."Produto";
    	   SuperShop         heap    postgres    false    6            �            1259    17353    Produto_idProduto_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Produto_idProduto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE "SuperShop"."Produto_idProduto_seq";
    	   SuperShop          postgres    false    6    227            S           0    0    Produto_idProduto_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE "SuperShop"."Produto_idProduto_seq" OWNED BY "SuperShop"."Produto"."idProduto";
       	   SuperShop          postgres    false    226            �            1259    17480    Quitacao_Despesa    TABLE     �   CREATE TABLE "SuperShop"."Quitacao_Despesa" (
    "idQuitacao_Despesa" integer NOT NULL,
    data_quitacao date NOT NULL,
    valor_quitado double precision NOT NULL
);
 +   DROP TABLE "SuperShop"."Quitacao_Despesa";
    	   SuperShop         heap    postgres    false    6            �            1259    17479 '   Quitacao_Despesa_idQuitacao_Despesa_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Quitacao_Despesa_idQuitacao_Despesa_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 E   DROP SEQUENCE "SuperShop"."Quitacao_Despesa_idQuitacao_Despesa_seq";
    	   SuperShop          postgres    false    242    6            T           0    0 '   Quitacao_Despesa_idQuitacao_Despesa_seq    SEQUENCE OWNED BY     �   ALTER SEQUENCE "SuperShop"."Quitacao_Despesa_idQuitacao_Despesa_seq" OWNED BY "SuperShop"."Quitacao_Despesa"."idQuitacao_Despesa";
       	   SuperShop          postgres    false    241            �            1259    17444    Quitacao_Venda    TABLE     �   CREATE TABLE "SuperShop"."Quitacao_Venda" (
    "idQuitacao" integer NOT NULL,
    data_quitacao date NOT NULL,
    valor_quitado double precision NOT NULL
);
 )   DROP TABLE "SuperShop"."Quitacao_Venda";
    	   SuperShop         heap    postgres    false    6            �            1259    17443    Quitacao_Venda_idQuitacao_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Quitacao_Venda_idQuitacao_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE "SuperShop"."Quitacao_Venda_idQuitacao_seq";
    	   SuperShop          postgres    false    6    236            U           0    0    Quitacao_Venda_idQuitacao_seq    SEQUENCE OWNED BY     o   ALTER SEQUENCE "SuperShop"."Quitacao_Venda_idQuitacao_seq" OWNED BY "SuperShop"."Quitacao_Venda"."idQuitacao";
       	   SuperShop          postgres    false    235            �            1259    17395    Reserva    TABLE       CREATE TABLE "SuperShop"."Reserva" (
    "idReserva" integer NOT NULL,
    data_reserva date NOT NULL,
    data_expiracao date NOT NULL,
    "Cliente_idCliente" integer NOT NULL,
    "Cliente_Pessoa_idPessoa" integer NOT NULL,
    "Produto_idProduto" integer NOT NULL
);
 "   DROP TABLE "SuperShop"."Reserva";
    	   SuperShop         heap    postgres    false    6            �            1259    17394    Reserva_idReserva_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Reserva_idReserva_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE "SuperShop"."Reserva_idReserva_seq";
    	   SuperShop          postgres    false    231    6            V           0    0    Reserva_idReserva_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE "SuperShop"."Reserva_idReserva_seq" OWNED BY "SuperShop"."Reserva"."idReserva";
       	   SuperShop          postgres    false    230            �            1259    17553    TipoDespesa    TABLE     �   CREATE TABLE "SuperShop"."TipoDespesa" (
    "idTipo" integer NOT NULL,
    nome_tipo character varying(255) NOT NULL,
    descricao_tipo text
);
 &   DROP TABLE "SuperShop"."TipoDespesa";
    	   SuperShop         heap    postgres    false    6            �            1259    17552    TipoDespesa_idTipo_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."TipoDespesa_idTipo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE "SuperShop"."TipoDespesa_idTipo_seq";
    	   SuperShop          postgres    false    250    6            W           0    0    TipoDespesa_idTipo_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE "SuperShop"."TipoDespesa_idTipo_seq" OWNED BY "SuperShop"."TipoDespesa"."idTipo";
       	   SuperShop          postgres    false    249            �            1259    17330    Usuario    TABLE     �  CREATE TABLE "SuperShop"."Usuario" (
    "idUsuario" integer NOT NULL,
    "Pessoa_idPessoa" integer NOT NULL,
    senha character varying(100) NOT NULL,
    cargo character varying(45) NOT NULL,
    cpf character varying(45) NOT NULL,
    rg character varying(45) NOT NULL,
    login character varying(45) NOT NULL,
    dt_contratacao date NOT NULL,
    "Comissao_idComissao" integer NOT NULL
);
 "   DROP TABLE "SuperShop"."Usuario";
    	   SuperShop         heap    postgres    false    6            �            1259    17329    Usuario_idUsuario_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Usuario_idUsuario_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE "SuperShop"."Usuario_idUsuario_seq";
    	   SuperShop          postgres    false    6    223            X           0    0    Usuario_idUsuario_seq    SEQUENCE OWNED BY     _   ALTER SEQUENCE "SuperShop"."Usuario_idUsuario_seq" OWNED BY "SuperShop"."Usuario"."idUsuario";
       	   SuperShop          postgres    false    222            �            1259    17412    Venda    TABLE     �  CREATE TABLE "SuperShop"."Venda" (
    "idVenda" integer NOT NULL,
    data date NOT NULL,
    desconto double precision,
    valor_total double precision NOT NULL,
    metodo_pgmto character varying(45) NOT NULL,
    "Usuario_idUsuario" integer NOT NULL,
    "Usuario_Pessoa_idPessoa" integer NOT NULL,
    "Cliente_idCliente" integer NOT NULL,
    "Cliente_Pessoa_idPessoa" integer NOT NULL
);
     DROP TABLE "SuperShop"."Venda";
    	   SuperShop         heap    postgres    false    6            �            1259    17411    Venda_idVenda_seq    SEQUENCE     �   CREATE SEQUENCE "SuperShop"."Venda_idVenda_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE "SuperShop"."Venda_idVenda_seq";
    	   SuperShop          postgres    false    233    6            Y           0    0    Venda_idVenda_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE "SuperShop"."Venda_idVenda_seq" OWNED BY "SuperShop"."Venda"."idVenda";
       	   SuperShop          postgres    false    232            #           2604    17298    Categoria idCategoria    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Categoria" ALTER COLUMN "idCategoria" SET DEFAULT nextval('"SuperShop"."Categoria_idCategoria_seq"'::regclass);
 M   ALTER TABLE "SuperShop"."Categoria" ALTER COLUMN "idCategoria" DROP DEFAULT;
    	   SuperShop          postgres    false    217    216    217            '           2604    17345    Cliente idCliente    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Cliente" ALTER COLUMN "idCliente" SET DEFAULT nextval('"SuperShop"."Cliente_idCliente_seq"'::regclass);
 I   ALTER TABLE "SuperShop"."Cliente" ALTER COLUMN "idCliente" DROP DEFAULT;
    	   SuperShop          postgres    false    225    224    225            $           2604    17307    Comissao idComissao    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Comissao" ALTER COLUMN "idComissao" SET DEFAULT nextval('"SuperShop"."Comissao_idComissao_seq"'::regclass);
 K   ALTER TABLE "SuperShop"."Comissao" ALTER COLUMN "idComissao" DROP DEFAULT;
    	   SuperShop          postgres    false    218    219    219            )           2604    17376    Compra idCompra    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Compra" ALTER COLUMN "idCompra" SET DEFAULT nextval('"SuperShop"."Compra_idCompra_seq"'::regclass);
 G   ALTER TABLE "SuperShop"."Compra" ALTER COLUMN "idCompra" DROP DEFAULT;
    	   SuperShop          postgres    false    229    228    229            0           2604    17490    Contas_a_Pagar idContas_a_Pagar    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar" ALTER COLUMN "idContas_a_Pagar" SET DEFAULT nextval('"SuperShop"."Contas_a_Pagar_idContas_a_Pagar_seq"'::regclass);
 W   ALTER TABLE "SuperShop"."Contas_a_Pagar" ALTER COLUMN "idContas_a_Pagar" DROP DEFAULT;
    	   SuperShop          postgres    false    243    244    244            -           2604    17454 #   Contas_a_Receber idContas_a_Receber    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Receber" ALTER COLUMN "idContas_a_Receber" SET DEFAULT nextval('"SuperShop"."Contas_a_Receber_idContas_a_Receber_seq"'::regclass);
 [   ALTER TABLE "SuperShop"."Contas_a_Receber" ALTER COLUMN "idContas_a_Receber" DROP DEFAULT;
    	   SuperShop          postgres    false    237    238    238            .           2604    17471    Despesa idDespesa    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Despesa" ALTER COLUMN "idDespesa" SET DEFAULT nextval('"SuperShop"."Despesa_idDespesa_seq"'::regclass);
 I   ALTER TABLE "SuperShop"."Despesa" ALTER COLUMN "idDespesa" DROP DEFAULT;
    	   SuperShop          postgres    false    240    239    240            1           2604    17507    Devolucao idDevolucao    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Devolucao" ALTER COLUMN "idDevolucao" SET DEFAULT nextval('"SuperShop"."Devolucao_idDevolucao_seq"'::regclass);
 M   ALTER TABLE "SuperShop"."Devolucao" ALTER COLUMN "idDevolucao" DROP DEFAULT;
    	   SuperShop          postgres    false    245    246    246            %           2604    17314    Fornecedor idFornecedor    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Fornecedor" ALTER COLUMN "idFornecedor" SET DEFAULT nextval('"SuperShop"."Fornecedor_idFornecedor_seq"'::regclass);
 O   ALTER TABLE "SuperShop"."Fornecedor" ALTER COLUMN "idFornecedor" DROP DEFAULT;
    	   SuperShop          postgres    false    221    220    221            !           2604    17271 %   Historico_Consumo idHistorico_Consumo    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Historico_Consumo" ALTER COLUMN "idHistorico_Consumo" SET DEFAULT nextval('"SuperShop"."Historico_Consumo_idHistorico_Consumo_seq"'::regclass);
 ]   ALTER TABLE "SuperShop"."Historico_Consumo" ALTER COLUMN "idHistorico_Consumo" DROP DEFAULT;
    	   SuperShop          postgres    false    213    212    213            2           2604    17524 !   Historico_Venda idHistorico_Venda    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Historico_Venda" ALTER COLUMN "idHistorico_Venda" SET DEFAULT nextval('"SuperShop"."Historico_Venda_idHistorico_Venda_seq"'::regclass);
 Y   ALTER TABLE "SuperShop"."Historico_Venda" ALTER COLUMN "idHistorico_Venda" DROP DEFAULT;
    	   SuperShop          postgres    false    247    248    248            "           2604    17280    Marca idMarca    DEFAULT     ~   ALTER TABLE ONLY "SuperShop"."Marca" ALTER COLUMN "idMarca" SET DEFAULT nextval('"SuperShop"."Marca_idMarca_seq"'::regclass);
 E   ALTER TABLE "SuperShop"."Marca" ALTER COLUMN "idMarca" DROP DEFAULT;
    	   SuperShop          postgres    false    215    214    215                        2604    17260    Pessoa idPessoa    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Pessoa" ALTER COLUMN "idPessoa" SET DEFAULT nextval('"SuperShop"."Pessoa_idPessoa_seq"'::regclass);
 G   ALTER TABLE "SuperShop"."Pessoa" ALTER COLUMN "idPessoa" DROP DEFAULT;
    	   SuperShop          postgres    false    210    211    211            (           2604    17357    Produto idProduto    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Produto" ALTER COLUMN "idProduto" SET DEFAULT nextval('"SuperShop"."Produto_idProduto_seq"'::regclass);
 I   ALTER TABLE "SuperShop"."Produto" ALTER COLUMN "idProduto" DROP DEFAULT;
    	   SuperShop          postgres    false    227    226    227            /           2604    17483 #   Quitacao_Despesa idQuitacao_Despesa    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Quitacao_Despesa" ALTER COLUMN "idQuitacao_Despesa" SET DEFAULT nextval('"SuperShop"."Quitacao_Despesa_idQuitacao_Despesa_seq"'::regclass);
 [   ALTER TABLE "SuperShop"."Quitacao_Despesa" ALTER COLUMN "idQuitacao_Despesa" DROP DEFAULT;
    	   SuperShop          postgres    false    242    241    242            ,           2604    17447    Quitacao_Venda idQuitacao    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Quitacao_Venda" ALTER COLUMN "idQuitacao" SET DEFAULT nextval('"SuperShop"."Quitacao_Venda_idQuitacao_seq"'::regclass);
 Q   ALTER TABLE "SuperShop"."Quitacao_Venda" ALTER COLUMN "idQuitacao" DROP DEFAULT;
    	   SuperShop          postgres    false    236    235    236            *           2604    17398    Reserva idReserva    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Reserva" ALTER COLUMN "idReserva" SET DEFAULT nextval('"SuperShop"."Reserva_idReserva_seq"'::regclass);
 I   ALTER TABLE "SuperShop"."Reserva" ALTER COLUMN "idReserva" DROP DEFAULT;
    	   SuperShop          postgres    false    230    231    231            3           2604    17556    TipoDespesa idTipo    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."TipoDespesa" ALTER COLUMN "idTipo" SET DEFAULT nextval('"SuperShop"."TipoDespesa_idTipo_seq"'::regclass);
 J   ALTER TABLE "SuperShop"."TipoDespesa" ALTER COLUMN "idTipo" DROP DEFAULT;
    	   SuperShop          postgres    false    249    250    250            &           2604    17333    Usuario idUsuario    DEFAULT     �   ALTER TABLE ONLY "SuperShop"."Usuario" ALTER COLUMN "idUsuario" SET DEFAULT nextval('"SuperShop"."Usuario_idUsuario_seq"'::regclass);
 I   ALTER TABLE "SuperShop"."Usuario" ALTER COLUMN "idUsuario" DROP DEFAULT;
    	   SuperShop          postgres    false    223    222    223            +           2604    17415    Venda idVenda    DEFAULT     ~   ALTER TABLE ONLY "SuperShop"."Venda" ALTER COLUMN "idVenda" SET DEFAULT nextval('"SuperShop"."Venda_idVenda_seq"'::regclass);
 E   ALTER TABLE "SuperShop"."Venda" ALTER COLUMN "idVenda" DROP DEFAULT;
    	   SuperShop          postgres    false    232    233    233                      0    17295 	   Categoria 
   TABLE DATA           ?   COPY "SuperShop"."Categoria" ("idCategoria", nome) FROM stdin;
 	   SuperShop          postgres    false    217         &          0    17342    Cliente 
   TABLE DATA           �   COPY "SuperShop"."Cliente" ("idCliente", "Pessoa_idPessoa", cpf, rg, voucher, "Historico_Consumo_idHistorico_Consumo") FROM stdin;
 	   SuperShop          postgres    false    225   9                 0    17304    Comissao 
   TABLE DATA           H   COPY "SuperShop"."Comissao" ("idComissao", mes, ano, valor) FROM stdin;
 	   SuperShop          postgres    false    219   �      *          0    17373    Compra 
   TABLE DATA           �   COPY "SuperShop"."Compra" ("idCompra", "Fornecedor_idFornecedor", "Fornecedor_Pessoa_idPessoa", "Produto_idProduto", "Usuario_idUsuario", "Usuario_Pessoa_idPessoa", dt_compra, total_compra, desconto, metodo_pgmto) FROM stdin;
 	   SuperShop          postgres    false    229   �      9          0    17487    Contas_a_Pagar 
   TABLE DATA           �   COPY "SuperShop"."Contas_a_Pagar" ("idContas_a_Pagar", numero_parcela, data_vencimento, valor_parcela, status, "Quitacao_Despesa_idQuitacao_Despesa", "Despesa_idDespesa") FROM stdin;
 	   SuperShop          postgres    false    244   �      3          0    17451    Contas_a_Receber 
   TABLE DATA           �   COPY "SuperShop"."Contas_a_Receber" ("idContas_a_Receber", numero_parcela, data_vencimento, valor_parcela, status, "Venda_idVenda", "Quitacao_idQuitacao") FROM stdin;
 	   SuperShop          postgres    false    238   �      5          0    17468    Despesa 
   TABLE DATA           �   COPY "SuperShop"."Despesa" ("idDespesa", dt_despesa, dt_vencimento, valor, metodo_pgmto, descricao, status, "Tipo_idTipo") FROM stdin;
 	   SuperShop          postgres    false    240         ;          0    17504 	   Devolucao 
   TABLE DATA           �   COPY "SuperShop"."Devolucao" ("idDevolucao", dt_devolucao, motivo, "Itens_Vendas_Venda_idVenda", "Itens_Vendas_Produto_idProduto", "Cliente_idCliente", "Cliente_Pessoa_idPessoa") FROM stdin;
 	   SuperShop          postgres    false    246   �      "          0    17311 
   Fornecedor 
   TABLE DATA           �   COPY "SuperShop"."Fornecedor" ("idFornecedor", cnpj, razao_social, qtd_min_pedido, prazo_entrega, dt_inicio_fornecimento, observacao, "Pessoa_idPessoa", "Marca_idMarca") FROM stdin;
 	   SuperShop          postgres    false    221                   0    17268    Historico_Consumo 
   TABLE DATA           T   COPY "SuperShop"."Historico_Consumo" ("idHistorico_Consumo", historico) FROM stdin;
 	   SuperShop          postgres    false    213   �      =          0    17521    Historico_Venda 
   TABLE DATA           g   COPY "SuperShop"."Historico_Venda" ("idHistorico_Venda", "Venda_idVenda", data_hora, acao) FROM stdin;
 	   SuperShop          postgres    false    248   �      /          0    17428    Itens_Vendas 
   TABLE DATA           i   COPY "SuperShop"."Itens_Vendas" ("Venda_idVenda", "Produto_idProduto", qtde, valor_unitario) FROM stdin;
 	   SuperShop          postgres    false    234                   0    17277    Marca 
   TABLE DATA           B   COPY "SuperShop"."Marca" ("idMarca", nome, descricao) FROM stdin;
 	   SuperShop          postgres    false    215   /                0    17257    Pessoa 
   TABLE DATA           �   COPY "SuperShop"."Pessoa" ("idPessoa", email, nome, end_rua, end_numero, end_bairro, end_complemento, cidade, estado, cep, telefone_1, telefone_2, data_nasc) FROM stdin;
 	   SuperShop          postgres    false    211   �      (          0    17354    Produto 
   TABLE DATA           �   COPY "SuperShop"."Produto" ("idProduto", sku, descricao, valor_custo, valor_venda, estoque_min, estoque_atual, status, "Categoria_idCategoria", "Fornecedor_idFornecedor", "Fornecedor_Pessoa_idPessoa") FROM stdin;
 	   SuperShop          postgres    false    227   ^      7          0    17480    Quitacao_Despesa 
   TABLE DATA           e   COPY "SuperShop"."Quitacao_Despesa" ("idQuitacao_Despesa", data_quitacao, valor_quitado) FROM stdin;
 	   SuperShop          postgres    false    242   {      1          0    17444    Quitacao_Venda 
   TABLE DATA           [   COPY "SuperShop"."Quitacao_Venda" ("idQuitacao", data_quitacao, valor_quitado) FROM stdin;
 	   SuperShop          postgres    false    236   �      ,          0    17395    Reserva 
   TABLE DATA           �   COPY "SuperShop"."Reserva" ("idReserva", data_reserva, data_expiracao, "Cliente_idCliente", "Cliente_Pessoa_idPessoa", "Produto_idProduto") FROM stdin;
 	   SuperShop          postgres    false    231   �      ?          0    17553    TipoDespesa 
   TABLE DATA           Q   COPY "SuperShop"."TipoDespesa" ("idTipo", nome_tipo, descricao_tipo) FROM stdin;
 	   SuperShop          postgres    false    250   �      $          0    17330    Usuario 
   TABLE DATA           �   COPY "SuperShop"."Usuario" ("idUsuario", "Pessoa_idPessoa", senha, cargo, cpf, rg, login, dt_contratacao, "Comissao_idComissao") FROM stdin;
 	   SuperShop          postgres    false    223   �	      .          0    17412    Venda 
   TABLE DATA           �   COPY "SuperShop"."Venda" ("idVenda", data, desconto, valor_total, metodo_pgmto, "Usuario_idUsuario", "Usuario_Pessoa_idPessoa", "Cliente_idCliente", "Cliente_Pessoa_idPessoa") FROM stdin;
 	   SuperShop          postgres    false    233   9
      Z           0    0    Categoria_idCategoria_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('"SuperShop"."Categoria_idCategoria_seq"', 6, true);
       	   SuperShop          postgres    false    216            [           0    0    Cliente_idCliente_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('"SuperShop"."Cliente_idCliente_seq"', 2, true);
       	   SuperShop          postgres    false    224            \           0    0    Comissao_idComissao_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('"SuperShop"."Comissao_idComissao_seq"', 2, true);
       	   SuperShop          postgres    false    218            ]           0    0    Compra_idCompra_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('"SuperShop"."Compra_idCompra_seq"', 4, true);
       	   SuperShop          postgres    false    228            ^           0    0 #   Contas_a_Pagar_idContas_a_Pagar_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('"SuperShop"."Contas_a_Pagar_idContas_a_Pagar_seq"', 1, false);
       	   SuperShop          postgres    false    243            _           0    0 '   Contas_a_Receber_idContas_a_Receber_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('"SuperShop"."Contas_a_Receber_idContas_a_Receber_seq"', 1, false);
       	   SuperShop          postgres    false    237            `           0    0    Despesa_idDespesa_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('"SuperShop"."Despesa_idDespesa_seq"', 36, true);
       	   SuperShop          postgres    false    239            a           0    0    Devolucao_idDevolucao_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('"SuperShop"."Devolucao_idDevolucao_seq"', 1, false);
       	   SuperShop          postgres    false    245            b           0    0    Fornecedor_idFornecedor_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('"SuperShop"."Fornecedor_idFornecedor_seq"', 2, true);
       	   SuperShop          postgres    false    220            c           0    0 )   Historico_Consumo_idHistorico_Consumo_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('"SuperShop"."Historico_Consumo_idHistorico_Consumo_seq"', 2, true);
       	   SuperShop          postgres    false    212            d           0    0 %   Historico_Venda_idHistorico_Venda_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('"SuperShop"."Historico_Venda_idHistorico_Venda_seq"', 1, false);
       	   SuperShop          postgres    false    247            e           0    0    Marca_idMarca_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('"SuperShop"."Marca_idMarca_seq"', 2, true);
       	   SuperShop          postgres    false    214            f           0    0    Pessoa_idPessoa_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('"SuperShop"."Pessoa_idPessoa_seq"', 2, true);
       	   SuperShop          postgres    false    210            g           0    0    Produto_idProduto_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('"SuperShop"."Produto_idProduto_seq"', 8, true);
       	   SuperShop          postgres    false    226            h           0    0 '   Quitacao_Despesa_idQuitacao_Despesa_seq    SEQUENCE SET     ]   SELECT pg_catalog.setval('"SuperShop"."Quitacao_Despesa_idQuitacao_Despesa_seq"', 1, false);
       	   SuperShop          postgres    false    241            i           0    0    Quitacao_Venda_idQuitacao_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('"SuperShop"."Quitacao_Venda_idQuitacao_seq"', 1, false);
       	   SuperShop          postgres    false    235            j           0    0    Reserva_idReserva_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('"SuperShop"."Reserva_idReserva_seq"', 1, false);
       	   SuperShop          postgres    false    230            k           0    0    TipoDespesa_idTipo_seq    SEQUENCE SET     L   SELECT pg_catalog.setval('"SuperShop"."TipoDespesa_idTipo_seq"', 19, true);
       	   SuperShop          postgres    false    249            l           0    0    Usuario_idUsuario_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('"SuperShop"."Usuario_idUsuario_seq"', 4, true);
       	   SuperShop          postgres    false    222            m           0    0    Venda_idVenda_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('"SuperShop"."Venda_idVenda_seq"', 1, false);
       	   SuperShop          postgres    false    232            A           2606    17302    Categoria Categoria_nome_key 
   CONSTRAINT     `   ALTER TABLE ONLY "SuperShop"."Categoria"
    ADD CONSTRAINT "Categoria_nome_key" UNIQUE (nome);
 O   ALTER TABLE ONLY "SuperShop"."Categoria" DROP CONSTRAINT "Categoria_nome_key";
    	   SuperShop            postgres    false    217            C           2606    17300    Categoria Categoria_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY "SuperShop"."Categoria"
    ADD CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idCategoria");
 K   ALTER TABLE ONLY "SuperShop"."Categoria" DROP CONSTRAINT "Categoria_pkey";
    	   SuperShop            postgres    false    217            O           2606    17347    Cliente Cliente_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY "SuperShop"."Cliente"
    ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("idCliente", "Pessoa_idPessoa");
 G   ALTER TABLE ONLY "SuperShop"."Cliente" DROP CONSTRAINT "Cliente_pkey";
    	   SuperShop            postgres    false    225    225            E           2606    17309    Comissao Comissao_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY "SuperShop"."Comissao"
    ADD CONSTRAINT "Comissao_pkey" PRIMARY KEY ("idComissao");
 I   ALTER TABLE ONLY "SuperShop"."Comissao" DROP CONSTRAINT "Comissao_pkey";
    	   SuperShop            postgres    false    219            W           2606    17378    Compra Compra_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY "SuperShop"."Compra"
    ADD CONSTRAINT "Compra_pkey" PRIMARY KEY ("idCompra");
 E   ALTER TABLE ONLY "SuperShop"."Compra" DROP CONSTRAINT "Compra_pkey";
    	   SuperShop            postgres    false    229            g           2606    17492 "   Contas_a_Pagar Contas_a_Pagar_pkey 
   CONSTRAINT     y   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar"
    ADD CONSTRAINT "Contas_a_Pagar_pkey" PRIMARY KEY ("idContas_a_Pagar");
 U   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar" DROP CONSTRAINT "Contas_a_Pagar_pkey";
    	   SuperShop            postgres    false    244            a           2606    17456 &   Contas_a_Receber Contas_a_Receber_pkey 
   CONSTRAINT        ALTER TABLE ONLY "SuperShop"."Contas_a_Receber"
    ADD CONSTRAINT "Contas_a_Receber_pkey" PRIMARY KEY ("idContas_a_Receber");
 Y   ALTER TABLE ONLY "SuperShop"."Contas_a_Receber" DROP CONSTRAINT "Contas_a_Receber_pkey";
    	   SuperShop            postgres    false    238            c           2606    17473    Despesa Despesa_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY "SuperShop"."Despesa"
    ADD CONSTRAINT "Despesa_pkey" PRIMARY KEY ("idDespesa");
 G   ALTER TABLE ONLY "SuperShop"."Despesa" DROP CONSTRAINT "Despesa_pkey";
    	   SuperShop            postgres    false    240            i           2606    17509    Devolucao Devolucao_pkey 
   CONSTRAINT     j   ALTER TABLE ONLY "SuperShop"."Devolucao"
    ADD CONSTRAINT "Devolucao_pkey" PRIMARY KEY ("idDevolucao");
 K   ALTER TABLE ONLY "SuperShop"."Devolucao" DROP CONSTRAINT "Devolucao_pkey";
    	   SuperShop            postgres    false    246            G           2606    17318    Fornecedor Fornecedor_cnpj_key 
   CONSTRAINT     b   ALTER TABLE ONLY "SuperShop"."Fornecedor"
    ADD CONSTRAINT "Fornecedor_cnpj_key" UNIQUE (cnpj);
 Q   ALTER TABLE ONLY "SuperShop"."Fornecedor" DROP CONSTRAINT "Fornecedor_cnpj_key";
    	   SuperShop            postgres    false    221            I           2606    17316    Fornecedor Fornecedor_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Fornecedor"
    ADD CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("idFornecedor", "Pessoa_idPessoa");
 M   ALTER TABLE ONLY "SuperShop"."Fornecedor" DROP CONSTRAINT "Fornecedor_pkey";
    	   SuperShop            postgres    false    221    221            ;           2606    17275 (   Historico_Consumo Historico_Consumo_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Historico_Consumo"
    ADD CONSTRAINT "Historico_Consumo_pkey" PRIMARY KEY ("idHistorico_Consumo");
 [   ALTER TABLE ONLY "SuperShop"."Historico_Consumo" DROP CONSTRAINT "Historico_Consumo_pkey";
    	   SuperShop            postgres    false    213            k           2606    17526 $   Historico_Venda Historico_Venda_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY "SuperShop"."Historico_Venda"
    ADD CONSTRAINT "Historico_Venda_pkey" PRIMARY KEY ("idHistorico_Venda");
 W   ALTER TABLE ONLY "SuperShop"."Historico_Venda" DROP CONSTRAINT "Historico_Venda_pkey";
    	   SuperShop            postgres    false    248            ]           2606    17432    Itens_Vendas Itens_Vendas_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Itens_Vendas"
    ADD CONSTRAINT "Itens_Vendas_pkey" PRIMARY KEY ("Venda_idVenda", "Produto_idProduto");
 Q   ALTER TABLE ONLY "SuperShop"."Itens_Vendas" DROP CONSTRAINT "Itens_Vendas_pkey";
    	   SuperShop            postgres    false    234    234            =           2606    17284    Marca Marca_nome_key 
   CONSTRAINT     X   ALTER TABLE ONLY "SuperShop"."Marca"
    ADD CONSTRAINT "Marca_nome_key" UNIQUE (nome);
 G   ALTER TABLE ONLY "SuperShop"."Marca" DROP CONSTRAINT "Marca_nome_key";
    	   SuperShop            postgres    false    215            ?           2606    17282    Marca Marca_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY "SuperShop"."Marca"
    ADD CONSTRAINT "Marca_pkey" PRIMARY KEY ("idMarca");
 C   ALTER TABLE ONLY "SuperShop"."Marca" DROP CONSTRAINT "Marca_pkey";
    	   SuperShop            postgres    false    215            7           2606    17266    Pessoa Pessoa_email_key 
   CONSTRAINT     \   ALTER TABLE ONLY "SuperShop"."Pessoa"
    ADD CONSTRAINT "Pessoa_email_key" UNIQUE (email);
 J   ALTER TABLE ONLY "SuperShop"."Pessoa" DROP CONSTRAINT "Pessoa_email_key";
    	   SuperShop            postgres    false    211            9           2606    17264    Pessoa Pessoa_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY "SuperShop"."Pessoa"
    ADD CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("idPessoa");
 E   ALTER TABLE ONLY "SuperShop"."Pessoa" DROP CONSTRAINT "Pessoa_pkey";
    	   SuperShop            postgres    false    211            S           2606    17359    Produto Produto_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY "SuperShop"."Produto"
    ADD CONSTRAINT "Produto_pkey" PRIMARY KEY ("idProduto");
 G   ALTER TABLE ONLY "SuperShop"."Produto" DROP CONSTRAINT "Produto_pkey";
    	   SuperShop            postgres    false    227            U           2606    17361    Produto Produto_sku_key 
   CONSTRAINT     Z   ALTER TABLE ONLY "SuperShop"."Produto"
    ADD CONSTRAINT "Produto_sku_key" UNIQUE (sku);
 J   ALTER TABLE ONLY "SuperShop"."Produto" DROP CONSTRAINT "Produto_sku_key";
    	   SuperShop            postgres    false    227            e           2606    17485 &   Quitacao_Despesa Quitacao_Despesa_pkey 
   CONSTRAINT        ALTER TABLE ONLY "SuperShop"."Quitacao_Despesa"
    ADD CONSTRAINT "Quitacao_Despesa_pkey" PRIMARY KEY ("idQuitacao_Despesa");
 Y   ALTER TABLE ONLY "SuperShop"."Quitacao_Despesa" DROP CONSTRAINT "Quitacao_Despesa_pkey";
    	   SuperShop            postgres    false    242            _           2606    17449 "   Quitacao_Venda Quitacao_Venda_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY "SuperShop"."Quitacao_Venda"
    ADD CONSTRAINT "Quitacao_Venda_pkey" PRIMARY KEY ("idQuitacao");
 U   ALTER TABLE ONLY "SuperShop"."Quitacao_Venda" DROP CONSTRAINT "Quitacao_Venda_pkey";
    	   SuperShop            postgres    false    236            Y           2606    17400    Reserva Reserva_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY "SuperShop"."Reserva"
    ADD CONSTRAINT "Reserva_pkey" PRIMARY KEY ("idReserva");
 G   ALTER TABLE ONLY "SuperShop"."Reserva" DROP CONSTRAINT "Reserva_pkey";
    	   SuperShop            postgres    false    231            m           2606    17560    TipoDespesa TipoDespesa_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY "SuperShop"."TipoDespesa"
    ADD CONSTRAINT "TipoDespesa_pkey" PRIMARY KEY ("idTipo");
 O   ALTER TABLE ONLY "SuperShop"."TipoDespesa" DROP CONSTRAINT "TipoDespesa_pkey";
    	   SuperShop            postgres    false    250            K           2606    17335    Usuario Usuario_pkey 
   CONSTRAINT     w   ALTER TABLE ONLY "SuperShop"."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario", "Pessoa_idPessoa");
 G   ALTER TABLE ONLY "SuperShop"."Usuario" DROP CONSTRAINT "Usuario_pkey";
    	   SuperShop            postgres    false    223    223            [           2606    17417    Venda Venda_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY "SuperShop"."Venda"
    ADD CONSTRAINT "Venda_pkey" PRIMARY KEY ("idVenda");
 C   ALTER TABLE ONLY "SuperShop"."Venda" DROP CONSTRAINT "Venda_pkey";
    	   SuperShop            postgres    false    233            o           2606    17579    TipoDespesa unique_nome_tipo 
   CONSTRAINT     c   ALTER TABLE ONLY "SuperShop"."TipoDespesa"
    ADD CONSTRAINT unique_nome_tipo UNIQUE (nome_tipo);
 M   ALTER TABLE ONLY "SuperShop"."TipoDespesa" DROP CONSTRAINT unique_nome_tipo;
    	   SuperShop            postgres    false    250            P           1259    17533     fk_Cliente_Historico_Consumo_idx    INDEX     �   CREATE INDEX "fk_Cliente_Historico_Consumo_idx" ON "SuperShop"."Cliente" USING btree ("Historico_Consumo_idHistorico_Consumo");
 ;   DROP INDEX "SuperShop"."fk_Cliente_Historico_Consumo_idx";
    	   SuperShop            postgres    false    225            Q           1259    17532    fk_Cliente_Pessoa_idx    INDEX     _   CREATE INDEX "fk_Cliente_Pessoa_idx" ON "SuperShop"."Cliente" USING btree ("Pessoa_idPessoa");
 0   DROP INDEX "SuperShop"."fk_Cliente_Pessoa_idx";
    	   SuperShop            postgres    false    225            L           1259    17540    fk_Usuario_Comissao_idx    INDEX     e   CREATE INDEX "fk_Usuario_Comissao_idx" ON "SuperShop"."Usuario" USING btree ("Comissao_idComissao");
 2   DROP INDEX "SuperShop"."fk_Usuario_Comissao_idx";
    	   SuperShop            postgres    false    223            M           1259    17539    fk_Usuario_Pessoa_idx    INDEX     _   CREATE INDEX "fk_Usuario_Pessoa_idx" ON "SuperShop"."Usuario" USING btree ("Pessoa_idPessoa");
 0   DROP INDEX "SuperShop"."fk_Usuario_Pessoa_idx";
    	   SuperShop            postgres    false    223            t           2606    17534 $   Cliente fk_Cliente_Historico_Consumo    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Cliente"
    ADD CONSTRAINT "fk_Cliente_Historico_Consumo" FOREIGN KEY ("Historico_Consumo_idHistorico_Consumo") REFERENCES "SuperShop"."Historico_Consumo"("idHistorico_Consumo");
 W   ALTER TABLE ONLY "SuperShop"."Cliente" DROP CONSTRAINT "fk_Cliente_Historico_Consumo";
    	   SuperShop          postgres    false    3643    225    213            u           2606    17348    Cliente fk_Cliente_Pessoa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Cliente"
    ADD CONSTRAINT "fk_Cliente_Pessoa" FOREIGN KEY ("Pessoa_idPessoa") REFERENCES "SuperShop"."Pessoa"("idPessoa") ON DELETE CASCADE;
 L   ALTER TABLE ONLY "SuperShop"."Cliente" DROP CONSTRAINT "fk_Cliente_Pessoa";
    	   SuperShop          postgres    false    225    211    3641            x           2606    17379    Compra fk_Compra_Fornecedor    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Compra"
    ADD CONSTRAINT "fk_Compra_Fornecedor" FOREIGN KEY ("Fornecedor_idFornecedor", "Fornecedor_Pessoa_idPessoa") REFERENCES "SuperShop"."Fornecedor"("idFornecedor", "Pessoa_idPessoa") ON DELETE CASCADE;
 N   ALTER TABLE ONLY "SuperShop"."Compra" DROP CONSTRAINT "fk_Compra_Fornecedor";
    	   SuperShop          postgres    false    229    229    3657    221    221            y           2606    17384    Compra fk_Compra_Produto    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Compra"
    ADD CONSTRAINT "fk_Compra_Produto" FOREIGN KEY ("Produto_idProduto") REFERENCES "SuperShop"."Produto"("idProduto") ON DELETE CASCADE;
 K   ALTER TABLE ONLY "SuperShop"."Compra" DROP CONSTRAINT "fk_Compra_Produto";
    	   SuperShop          postgres    false    227    3667    229            z           2606    17389    Compra fk_Compra_Usuario    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Compra"
    ADD CONSTRAINT "fk_Compra_Usuario" FOREIGN KEY ("Usuario_idUsuario", "Usuario_Pessoa_idPessoa") REFERENCES "SuperShop"."Usuario"("idUsuario", "Pessoa_idPessoa") ON DELETE CASCADE;
 K   ALTER TABLE ONLY "SuperShop"."Compra" DROP CONSTRAINT "fk_Compra_Usuario";
    	   SuperShop          postgres    false    3659    223    223    229    229            �           2606    17498 (   Contas_a_Pagar fk_Contas_a_Pagar_Despesa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar"
    ADD CONSTRAINT "fk_Contas_a_Pagar_Despesa" FOREIGN KEY ("Despesa_idDespesa") REFERENCES "SuperShop"."Despesa"("idDespesa");
 [   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar" DROP CONSTRAINT "fk_Contas_a_Pagar_Despesa";
    	   SuperShop          postgres    false    240    3683    244            �           2606    17493 1   Contas_a_Pagar fk_Contas_a_Pagar_Quitacao_Despesa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar"
    ADD CONSTRAINT "fk_Contas_a_Pagar_Quitacao_Despesa" FOREIGN KEY ("Quitacao_Despesa_idQuitacao_Despesa") REFERENCES "SuperShop"."Quitacao_Despesa"("idQuitacao_Despesa");
 d   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar" DROP CONSTRAINT "fk_Contas_a_Pagar_Quitacao_Despesa";
    	   SuperShop          postgres    false    3685    242    244            �           2606    17462 -   Contas_a_Receber fk_Contas_a_Receber_Quitacao    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Receber"
    ADD CONSTRAINT "fk_Contas_a_Receber_Quitacao" FOREIGN KEY ("Quitacao_idQuitacao") REFERENCES "SuperShop"."Quitacao_Venda"("idQuitacao") ON DELETE CASCADE;
 `   ALTER TABLE ONLY "SuperShop"."Contas_a_Receber" DROP CONSTRAINT "fk_Contas_a_Receber_Quitacao";
    	   SuperShop          postgres    false    238    3679    236            �           2606    17457 *   Contas_a_Receber fk_Contas_a_Receber_Venda    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Receber"
    ADD CONSTRAINT "fk_Contas_a_Receber_Venda" FOREIGN KEY ("Venda_idVenda") REFERENCES "SuperShop"."Venda"("idVenda") ON DELETE CASCADE;
 ]   ALTER TABLE ONLY "SuperShop"."Contas_a_Receber" DROP CONSTRAINT "fk_Contas_a_Receber_Venda";
    	   SuperShop          postgres    false    238    3675    233            �           2606    17568    Despesa fk_Despesa_TipoDespesa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Despesa"
    ADD CONSTRAINT "fk_Despesa_TipoDespesa" FOREIGN KEY ("Tipo_idTipo") REFERENCES "SuperShop"."TipoDespesa"("idTipo") ON DELETE CASCADE;
 Q   ALTER TABLE ONLY "SuperShop"."Despesa" DROP CONSTRAINT "fk_Despesa_TipoDespesa";
    	   SuperShop          postgres    false    3693    250    240            �           2606    17515    Devolucao fk_Devolucao_Cliente    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Devolucao"
    ADD CONSTRAINT "fk_Devolucao_Cliente" FOREIGN KEY ("Cliente_idCliente", "Cliente_Pessoa_idPessoa") REFERENCES "SuperShop"."Cliente"("idCliente", "Pessoa_idPessoa");
 Q   ALTER TABLE ONLY "SuperShop"."Devolucao" DROP CONSTRAINT "fk_Devolucao_Cliente";
    	   SuperShop          postgres    false    246    225    225    246    3663            �           2606    17510 #   Devolucao fk_Devolucao_Itens_Vendas    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Devolucao"
    ADD CONSTRAINT "fk_Devolucao_Itens_Vendas" FOREIGN KEY ("Itens_Vendas_Venda_idVenda", "Itens_Vendas_Produto_idProduto") REFERENCES "SuperShop"."Itens_Vendas"("Venda_idVenda", "Produto_idProduto");
 V   ALTER TABLE ONLY "SuperShop"."Devolucao" DROP CONSTRAINT "fk_Devolucao_Itens_Vendas";
    	   SuperShop          postgres    false    234    234    246    246    3677            p           2606    17324    Fornecedor fk_Fornecedor_Marca    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Fornecedor"
    ADD CONSTRAINT "fk_Fornecedor_Marca" FOREIGN KEY ("Marca_idMarca") REFERENCES "SuperShop"."Marca"("idMarca") ON DELETE CASCADE;
 Q   ALTER TABLE ONLY "SuperShop"."Fornecedor" DROP CONSTRAINT "fk_Fornecedor_Marca";
    	   SuperShop          postgres    false    215    3647    221            q           2606    17319    Fornecedor fk_Fornecedor_Pessoa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Fornecedor"
    ADD CONSTRAINT "fk_Fornecedor_Pessoa" FOREIGN KEY ("Pessoa_idPessoa") REFERENCES "SuperShop"."Pessoa"("idPessoa") ON DELETE CASCADE;
 R   ALTER TABLE ONLY "SuperShop"."Fornecedor" DROP CONSTRAINT "fk_Fornecedor_Pessoa";
    	   SuperShop          postgres    false    211    221    3641            �           2606    17527 (   Historico_Venda fk_Historico_Venda_Venda    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Historico_Venda"
    ADD CONSTRAINT "fk_Historico_Venda_Venda" FOREIGN KEY ("Venda_idVenda") REFERENCES "SuperShop"."Venda"("idVenda") ON DELETE CASCADE;
 [   ALTER TABLE ONLY "SuperShop"."Historico_Venda" DROP CONSTRAINT "fk_Historico_Venda_Venda";
    	   SuperShop          postgres    false    3675    233    248                       2606    17438 $   Itens_Vendas fk_Itens_Vendas_Produto    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Itens_Vendas"
    ADD CONSTRAINT "fk_Itens_Vendas_Produto" FOREIGN KEY ("Produto_idProduto") REFERENCES "SuperShop"."Produto"("idProduto") ON DELETE CASCADE;
 W   ALTER TABLE ONLY "SuperShop"."Itens_Vendas" DROP CONSTRAINT "fk_Itens_Vendas_Produto";
    	   SuperShop          postgres    false    234    3667    227            �           2606    17433 "   Itens_Vendas fk_Itens_Vendas_Venda    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Itens_Vendas"
    ADD CONSTRAINT "fk_Itens_Vendas_Venda" FOREIGN KEY ("Venda_idVenda") REFERENCES "SuperShop"."Venda"("idVenda") ON DELETE CASCADE;
 U   ALTER TABLE ONLY "SuperShop"."Itens_Vendas" DROP CONSTRAINT "fk_Itens_Vendas_Venda";
    	   SuperShop          postgres    false    234    233    3675            v           2606    17362    Produto fk_Produto_Categoria    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Produto"
    ADD CONSTRAINT "fk_Produto_Categoria" FOREIGN KEY ("Categoria_idCategoria") REFERENCES "SuperShop"."Categoria"("idCategoria") ON DELETE CASCADE;
 O   ALTER TABLE ONLY "SuperShop"."Produto" DROP CONSTRAINT "fk_Produto_Categoria";
    	   SuperShop          postgres    false    217    227    3651            w           2606    17367    Produto fk_Produto_Fornecedor    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Produto"
    ADD CONSTRAINT "fk_Produto_Fornecedor" FOREIGN KEY ("Fornecedor_idFornecedor", "Fornecedor_Pessoa_idPessoa") REFERENCES "SuperShop"."Fornecedor"("idFornecedor", "Pessoa_idPessoa") ON DELETE CASCADE;
 P   ALTER TABLE ONLY "SuperShop"."Produto" DROP CONSTRAINT "fk_Produto_Fornecedor";
    	   SuperShop          postgres    false    221    221    3657    227    227            {           2606    17401    Reserva fk_Reserva_Cliente    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Reserva"
    ADD CONSTRAINT "fk_Reserva_Cliente" FOREIGN KEY ("Cliente_idCliente", "Cliente_Pessoa_idPessoa") REFERENCES "SuperShop"."Cliente"("idCliente", "Pessoa_idPessoa") ON DELETE CASCADE;
 M   ALTER TABLE ONLY "SuperShop"."Reserva" DROP CONSTRAINT "fk_Reserva_Cliente";
    	   SuperShop          postgres    false    225    3663    231    225    231            |           2606    17406    Reserva fk_Reserva_Produto    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Reserva"
    ADD CONSTRAINT "fk_Reserva_Produto" FOREIGN KEY ("Produto_idProduto") REFERENCES "SuperShop"."Produto"("idProduto") ON DELETE CASCADE;
 M   ALTER TABLE ONLY "SuperShop"."Reserva" DROP CONSTRAINT "fk_Reserva_Produto";
    	   SuperShop          postgres    false    231    227    3667            r           2606    17541    Usuario fk_Usuario_Comissao    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Usuario"
    ADD CONSTRAINT "fk_Usuario_Comissao" FOREIGN KEY ("Comissao_idComissao") REFERENCES "SuperShop"."Comissao"("idComissao");
 N   ALTER TABLE ONLY "SuperShop"."Usuario" DROP CONSTRAINT "fk_Usuario_Comissao";
    	   SuperShop          postgres    false    219    3653    223            s           2606    17336    Usuario fk_Usuario_Pessoa1    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Usuario"
    ADD CONSTRAINT "fk_Usuario_Pessoa1" FOREIGN KEY ("Pessoa_idPessoa") REFERENCES "SuperShop"."Pessoa"("idPessoa") ON DELETE CASCADE;
 M   ALTER TABLE ONLY "SuperShop"."Usuario" DROP CONSTRAINT "fk_Usuario_Pessoa1";
    	   SuperShop          postgres    false    223    3641    211            }           2606    17423    Venda fk_Venda_Cliente    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Venda"
    ADD CONSTRAINT "fk_Venda_Cliente" FOREIGN KEY ("Cliente_idCliente", "Cliente_Pessoa_idPessoa") REFERENCES "SuperShop"."Cliente"("idCliente", "Pessoa_idPessoa") ON DELETE CASCADE;
 I   ALTER TABLE ONLY "SuperShop"."Venda" DROP CONSTRAINT "fk_Venda_Cliente";
    	   SuperShop          postgres    false    233    225    3663    233    225            ~           2606    17418    Venda fk_Venda_Usuario    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Venda"
    ADD CONSTRAINT "fk_Venda_Usuario" FOREIGN KEY ("Usuario_idUsuario", "Usuario_Pessoa_idPessoa") REFERENCES "SuperShop"."Usuario"("idUsuario", "Pessoa_idPessoa") ON DELETE CASCADE;
 I   ALTER TABLE ONLY "SuperShop"."Venda" DROP CONSTRAINT "fk_Venda_Usuario";
    	   SuperShop          postgres    false    233    3659    223    223    233            �           2606    17547 (   Contas_a_Pagar fk_contas_a_pagar_despesa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar"
    ADD CONSTRAINT fk_contas_a_pagar_despesa FOREIGN KEY ("Despesa_idDespesa") REFERENCES "SuperShop"."Despesa"("idDespesa") ON DELETE CASCADE;
 Y   ALTER TABLE ONLY "SuperShop"."Contas_a_Pagar" DROP CONSTRAINT fk_contas_a_pagar_despesa;
    	   SuperShop          postgres    false    240    3683    244            �           2606    17561    Despesa fk_despesa_tipodespesa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Despesa"
    ADD CONSTRAINT fk_despesa_tipodespesa FOREIGN KEY ("Tipo_idTipo") REFERENCES "SuperShop"."TipoDespesa"("idTipo") ON DELETE SET NULL;
 O   ALTER TABLE ONLY "SuperShop"."Despesa" DROP CONSTRAINT fk_despesa_tipodespesa;
    	   SuperShop          postgres    false    250    3693    240            �           2606    17580    Despesa fk_tipodespesa    FK CONSTRAINT     �   ALTER TABLE ONLY "SuperShop"."Despesa"
    ADD CONSTRAINT fk_tipodespesa FOREIGN KEY ("Tipo_idTipo") REFERENCES "SuperShop"."TipoDespesa"("idTipo") ON DELETE RESTRICT;
 G   ALTER TABLE ONLY "SuperShop"."Despesa" DROP CONSTRAINT fk_tipodespesa;
    	   SuperShop          postgres    false    250    3693    240               $   x�3��/-H,�2�tLN-.>��(3��+F��� �_�      &   9   x�3�4�4426153��40��57�p9�M�8��8� ���� yS$y#�=... ��          $   x�3�44�4202�450�2�44��LL�b���� T[�      *      x������ � �      9      x������ � �      3      x������ � �      5   �   x�e�1n�0E��)|�m�"��m7�H��hK�A�Y�>)r���Ő�������eN�օj�Q��J)h�'���H>��H�0�3В��@����4PY�?��ŉ"�U�p�Ӹ������#�@mK{��8qH$'(��Ļ崣�>�)�mTY[x�Ù�)�[����ۛع|]E�gi�b�����;�cI�\Z~��n�w��d�R�(�`S      ;      x������ � �      "   \   x�M�1
�0�z�~@��\L�Kk;�5��*X�AǔU��`��:��[@E��y�|`�AP%�1z�7��O+AW��2�l���s��         ]   x�3�t��-(J,VH+J-,M�+I-VHIU(�/- 
�*$&��\��_��eW���X�����	V]Z��W|xmP���_���������� '�#�      =      x������ � �      /      x������ � �         V   x�3����N��M,JNTHIU(�/-H,VHUHLN-.>��(3�+.�/*�,�/�2�tL�LI,F�HN�9�<1���>��+F��� 5+#�         �   x�}�;�0D��)|�D^���(@�"��,ą�#����"
h�43���V�O֥������D9X�Აi�G��k8���O�/�<��B�؎<���z�F!G�,/ʪn�����3��2A�`.4x����D�v5�I�#�ց.�Dq�^v��f���Xhηŵ�Q��]�k*�xn�M�      (      x������ � �      7      x������ � �      1      x������ � �      ,      x������ � �      ?   �   x�MOAJA<�_��ݣ�<+x��%�ֆ�d�N>g��C�c�8.�PIU�r#I3��{�Rx�p��Ag,�Pъ��?���[�]�$\-�,�Qg��_�NB�bp�s;7��L�iw��
�H�v���5.��C�	����z٬"O�cj��z�z�8�M)�H�w��H%)�p)$��@5nu�5:��N�	��$��+"������m�      $   o   x�U̽�0������-�|�6H�%�����LG��[��,��>�3�cq��e��^pߖ�_���Ć�q0�;�^��V�'T5-g�Г1�%�[��M"z�"~      .      x������ � �     