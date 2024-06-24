import { useState, useEffect, useContext } from 'react'

import Title from "../../components/Title"
import Header from "../../components/header"
import { FiPlusCircle } from "react-icons/fi"

import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { AuthContext } from '../../contexts/auth'

import { toast } from 'react-toastify'


import './new.css'

const Assunto = [
    {'name': 'Suporte','value': 'suporte'},
    {'name': 'Visita Técnica','value': 'visita tecnica'},
    {'name': 'Financeiro','value': 'financeiro'}
]

export default function New(){
    const { user } = useContext(AuthContext)
    const [customers, setCustomers] = useState([])
    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('aberto')
    const [loadingCustomers, setLoadingCustomers] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(null)
    console.log('teste', customers)
 
    const collectionRef = collection(db,'customers')

    useEffect(() => {
        async function getCustomers(){
            let list = []
            await getDocs(collectionRef)
            .then(snapshot => {
                let data = {}
                snapshot.docs.forEach(doc => {
                    data  = doc.data()
                    data.id = doc.id
                   list.push(data)
                })
                setCustomers(list)
                setCustomerSelected(list[0])
                setLoadingCustomers(false)
            })
            .catch(() => { 
                toast.error("Ocorreu algum erro!\nTente novamente.")
                setLoadingCustomers(false)})
        }
        getCustomers();
    }, [])

    function  handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleCustomersChange(e){
        setCustomerSelected(customers.find(item => item.id === e.target.value))
    }

    async function handleSubmit(e){
        e.preventDefault();
        let payload = {
            'client': customerSelected,
            'assunto': assunto,
            'status': status,
            'complemento': complemento,
            'createdBy': user?.uid,
            'createdDate': new Date()
        }

        await addDoc(collection(db, "chamados"), payload)
        .then(()=>{
            toast.success("Chamado registrado!")
            setComplemento('')
            setCustomerSelected(0)
            setAssunto('Suporte')
        })
        .catch(err => {
            toast.error('Ocorreu algum erro!\nTente novamente.')
        })
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Novo chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        
                        <label>Clientes</label>
                        {loadingCustomers ? (
                        <input type='text' disabled={true}  value='Carregando...'/>)
                        : (
                        <select value={customerSelected} onChange={handleCustomersChange}>
                            {customers?.map((item, index) => {
                                return(
                                <option key={index} value={item?.id}>{item?.nomeFantasia}</option>
                                )
                            }
                            )}
                        </select>)
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={(e)=>setAssunto(e.target.value)}>
                            {Assunto.map((item, index) => {
                                return(
                                    <option key={index}>{item?.name}</option>
                                )
                            })}
                        
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