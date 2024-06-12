import { useState } from 'react'

import Title from "../../components/Title"
import Header from "../../components/header"
import { FiPlusCircle } from "react-icons/fi"

import './new.css'

export default function New(){
    const [customers, setCustomers] = ([])
    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('aberto')

    function  handleOptionChange(e){
        setStatus(e.target.value)
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile">
                        
                        <label>Clientes</label>
                        <select>
                            <option key={1} value={1}>Mercado Livre</option>
                            <option key={2} value={2}>Loja informática</option>
                        </select>

                        <label>Assunto</label>
                        <select>
                            <option value="suporte">Suporte</option>
                            <option value="visita tecnica">Visita Técnica</option>
                            <option value="financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input 
                            type="radio"
                            name="radio"
                            value="aberto"
                            onChange={handleOptionChange}
                            checked={ status === "aberto"}
                            />
                            <span>Em aberto</span>

                            <input 
                            type="radio"
                            name="radio"
                            value="progresso"
                            onChange={handleOptionChange}
                            checked={ status === "progresso"}
                            />
                            <span>Progresso</span>

                            <input 
                            type="radio"
                            name="radio"
                            value="atendido"
                            onChange={handleOptionChange}
                            checked={ status === "atendido"}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                         type="text"
                         placeholder="Descreva o seu problema (opcional)"
                         value={complemento}
                         onChange={e => setComplemento(e.target.value)}
                        />

                        <button type="submit">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}