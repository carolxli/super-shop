import React, { useState } from 'react';
import axios from 'axios';
import InputMask from 'react-input-mask';
import { NumericFormat } from 'react-number-format';

const FormFornecedor = () => {
    const [fornecedor, setFornecedor] = useState({
        cnpj: '',
        razao_social: '',
        valor_min_pedido: '',
        prazo_entrega: '',
        dt_inicio_fornecimento: '',
        observacao: '',
        Pessoa_idPessoa: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Impede valores negativos em campos numéricos
        if ((name === 'prazo_entrega' || name === 'Pessoa_idPessoa') && value < 0) return;

        setFornecedor({
            ...fornecedor,
            [name]: value,
        });
    };

    // Busca automática da Razão Social
    const fetchRazaoSocial = async (cnpj) => {
        if (cnpj.length === 14) {
            try {
                const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
                if (response.data && response.data.razao_social) {
                    setFornecedor((prevFornecedor) => ({
                        ...prevFornecedor,
                        razao_social: response.data.razao_social,
                    }));
                } else {
                    alert('Razão Social não encontrada');
                }
            } catch (error) {
                console.error("Erro ao buscar razão social:", error);
                alert('Erro ao buscar razão social');
            }
        }
    };

    const handleCnpjChange = (e) => {
        const cnpj = e.target.value.replace(/[^\d]/g, ''); // Remove máscara para usar na API
        setFornecedor({ ...fornecedor, cnpj });
        // Busca a razão social apenas quando o CNPJ tiver 14 caracteres
        if (cnpj.length === 14) {
            fetchRazaoSocial(cnpj);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8800/fornecedor', fornecedor);
            alert('Fornecedor cadastrado com sucesso!');
            setFornecedor({
                cnpj: '',
                razao_social: '',
                valor_min_pedido: '',
                prazo_entrega: '',
                dt_inicio_fornecimento: '',
                observacao: '',
                Pessoa_idPessoa: '',
            });
        } catch (err) {
            console.error(err);
            alert('Erro ao cadastrar fornecedor');
        }
    };

    return (
        <>
            <h3>Cadastrar Fornecedor</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    CNPJ
                    <InputMask
                        mask="99.999.999/9999-99"
                        name="cnpj"
                        value={fornecedor.cnpj}
                        onChange={handleCnpjChange}
                        maxLength="18" // Limita a quantidade de caracteres para um CNPJ válido
                        maskChar={null} // Remove o caractere de máscara para facilitar a digitação
                        required
                    />
                </label>

                <label>
                    Razão Social
                    <input
                        type="text"
                        name="razao_social"
                        value={fornecedor.razao_social}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Valor Mínimo de Pedido
                    <NumericFormat
                        thousandSeparator={true}
                        prefix={'R$ '}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        name="valor_min_pedido"
                        value={fornecedor.valor_min_pedido}
                        onValueChange={(values) => {
                            const { value } = values;
                            setFornecedor({ ...fornecedor, valor_min_pedido: value });
                        }}
                        required
                    />
                </label>

                <label>
                    Prazo de Entrega (dias)
                    <input
                        type="number"
                        name="prazo_entrega"
                        value={fornecedor.prazo_entrega}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Data de Início
                    <input
                        type="date"
                        name="dt_inicio_fornecimento"
                        value={fornecedor.dt_inicio_fornecimento}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    ID da Pessoa
                    <input
                        type="number"
                        name="Pessoa_idPessoa"
                        value={fornecedor.Pessoa_idPessoa}
                        onChange={handleChange}
                        disabled
                    />
                </label>

                <label>
                    Observação
                    <textarea name="observacao" value={fornecedor.observacao} onChange={handleChange} />
                </label>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '90px', marginLeft: '90px' }}>
                    <button type="submit">Cadastrar</button>
                    <a href='/'>
                        <button type="button">Cancelar</button>
                    </a>
                </div>
            </form>
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '10px', marginLeft: '256px' }}>
                <a href="/listar-fornecedores">
                    <button>Listar Fornecedores Cadastradas</button>
                </a>
            </div>
        </>
    );
};

export default FormFornecedor;
