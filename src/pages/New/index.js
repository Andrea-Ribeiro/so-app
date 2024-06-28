import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Title from "../../components/Title"
import Header from "../../components/header"
import { FiPlusCircle } from "react-icons/fi"

import { collection, getDocs, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore'
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
    const { id } = useParams();
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([])
    const [complemento, setComplemento] = useState('')
    const [assunto, setAssunto] = useState('Suporte')
    const [status, setStatus] = useState('aberto')
    const [loadingCustomers, setLoadingCustomers] = useState(true)
    const [customerSelected, setCustomerSelected] = useState(customers.length > 0 ? customers[0].id : null)
    
 
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
                setCustomerSelected(list[0].id)
                setLoadingCustomers(false)

                if (id){
                    loadDoc(list)
                }
            })
            .catch(() => { 
                toast.error("Ocorreu algum erro!\nTente novamente.")
                setLoadingCustomers(false)})
        }
        getCustomers();
    }, [id])

    async function loadDoc(list){
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot)=>{
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

           let index = list.findIndex(item => item.id === snapshot.data().client.id)
           setCustomerSelected(list[index].id)


        })
        .catch((error)=>{console.log(error)}
    )
    
    }

    function  handleOptionChange(e){
        setStatus(e.target.value)
    }

    function handleCustomersChange(e){
        setCustomerSelected(e.target.value)
    }

    async function handleSubmit(e){
        e.preventDefault();
        const customer = customers.find(item=>item?.id === customerSelected)

        if(id){

            const docRef = doc(db, "chamados", id);
            let payload = {
                'client': customer,
                'assunto': assunto,
                'status': status,
                'complemento': complemento,
                'createdBy': user?.uid,
            }

            await updateDoc(docRef, payload)
            .then(()=>{toast.success("Chamado atualizado com sucesso!")
                setComplemento('')
                setCustomerSelected(0)
                setAssunto('Suporte')
                navigate('/dashboard')
            })
            .catch(()=>{toast.error("Ocorreu algum erro!\nTente novamente.")})
        }else{
            
        let payload = {
            'client': customer,
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
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name={id ? "Editar chamado": "Novo chamado"}>
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

                        <button type="submit">{id ? 'Atualizar' : 'Registrar'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}