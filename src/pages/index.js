import Image from 'next/image'
import { Inter } from 'next/font/google'
import {useState, useEffect} from 'react';
import axios from 'axios';
import send from '../send-icon.png';
import icon from '../icon.png';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setChatLog((prevChat)=>[...prevChat,{type:'user', message: inputValue}]);
    sendMessage(inputValue)
    setInputValue('');
  }

  const sendMessage = (message) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-type':'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
    };
    const data = {
      model:"gpt-3.5-turbo",
      messages: [{"role":"user","content":message}]
    }
    setIsLoading(true);
    axios.post(url, data, {headers:headers}).then((response)=>{
      console.log('hi')
      console.log(response)
      setChatLog((prev) => [...prev, {type:'bot', message: response.data.choices[0].message.content}])
      setIsLoading(false)
    }).catch((e)=> {
      setIsLoading(false)
      console.log('error', e)
    })
  }

  return (
    <div className='mx-auto bg-[#242424] h-screen w-screen justify-center flex'>
      <Image src={icon} alt="icon" height={100} width={100} className='fixed top-0'/>
      <div className='box fixed bottom-0 pt-16 w-screen md:w-[570px] pb-16'>
        <div>
          <h1 className='text-center text-xl'>Welcome to Kleightonn<span className='text-[#7000FF]'>AI</span></h1>
        </div>
        <div className="flex-grow p-6 ">
          <div className="flex flex-col overflow-y-scroll">
            {chatLog.map((message, i)=>
            <div key={i} className='text-center p-3'>
              {message.type === 'user' ? <h2 className='text-[#242424] text-md md:text-lg text-left'>{message.message}</h2> : <h2 className='text-[#7000FF] text-md md:text-lg text-right p-3'>{message.message}</h2>}
            </div>
            )}
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='fixed bottom-0 pr-4'>
        <input type="text" placeholder='Type your question...' value={inputValue} onChange={(e)=>setInputValue(e.target.value)} id="chat"/>
        <button type="submit">
          <Image src={send} alt="send" height={25} width={25} />
        </button>
      </form>
    </div>

  )
}
