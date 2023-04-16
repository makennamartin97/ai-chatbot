import Image from 'next/image'
import { Inter } from 'next/font/google'
import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import TypingAnimation from "../components/TypingAnimation";
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatLog]);

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
      <img src={"/icon.png"} alt="icon" className='fixed top-0 h-[100px]'/>
      <div className='box fixed bottom-0 pt-16 w-screen pb-16'>
        <div>
          <h1 className='text-center text-xl'>Welcome to Kleightonn<span className='text-[#7000FF]'>AI</span></h1>
        </div>
        <div className="flex-grow p-6 lg:pl-72 lg:pr-72">
          <div className="flex flex-col overflow-y-scroll">
            {
        chatLog.map((message, index) => (
          <div key={index} className={`flex ${
            message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
            <div className={`${
              message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'
            } rounded-lg p-2 m-1 text-white max-w-sm`}>
            {message.message}
            </div>
            </div>
        ))
            }
            {
              isLoading &&
              <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-2 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
              </div>
            }
          </div>
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="fixed bottom-0 w-screen p-6 bg-white">
          <div className="flex rounded-lg border border-gray-700 bg-white w-full ml-4 mr-4 md:ml-16 md:mr-16 lg:ml-32 lg:mr-32">  
        <input type="text" className="flex-grow px-4 py-2 bg-transparent focus:outline-none" placeholder="Type your message..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <button type="submit" className="bg-purple-500 rounded-lg px-4 py-2 font-semibold focus:outline-none">Send</button>
            </div>
        </form>
      </div>
    </div>

  )
}
