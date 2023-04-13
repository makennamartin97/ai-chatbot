import Image from 'next/image'
import { Inter } from 'next/font/google'
import {useState, useEffect} from 'react';
import axios from 'axios';

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
      model:"gpt-3.5-turbo-0301",
      messages: [{"role":"user","content": message}]
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
    <div>
    {chatLog.map((message, i)=>
    (<div key="i">
      {message.message}
    </div>)
    )}
    <h1>ChatGPT</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder='Type your question...' value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>

  )
}
