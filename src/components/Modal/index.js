import './modal.css';
import { FiX } from 'react-icons/fi'
import { format } from "date-fns";


export default function Modal({data, close}){

    return (
       
        <div className='modal'>
            <div className='container'>
                <button className='close' onClick={close}>
                    <FiX size={25}/>
                    Voltar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className='row'>
                        <span>
                            Client: <i>{data?.client?.nomeFantasia}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Assunto: <i>{data?.assunto}</i>
                        </span>
                        <span>
                            Cadastrado em : <i>{format(data?.createdDate.toDate(), 'dd/MM/yyy')}</i>
                        </span>
                    </div>

                    <div className='row'>
                        <span>
                            Status: 
                            <i className='status-badge' style={{color: "#FFF", backgroundColor: data?.status === 'aberto' ? '#5cb85c' : '#999'}}>
                                {(data?.status)[0].toUpperCase() + (data?.status).substring(1)}
                                </i>
                        </span>
                    </div>

                    {data?.complemento && (<>
                    <h3>Complemento</h3>
                        <p>{data?.complemento}</p>
                    </>)}
                    
                </main>
            </div>
        </div>
    )
}