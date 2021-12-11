import React, { useEffect, useState, useRef } from "react";
import getWeb3 from "./getWeb3";
import { abii } from './contracts/abi.js'
import Button from '@mui/material/Button'
import CircularIndeterminate from './CircularIndeterminate'
import NativeSelectDemo from './NativeSelectDemo';
import CustomizedDialogs from "./CustomizedDialogs";
import ChatContract from "./contracts/Chat.json";


import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

import "./App.css";
let chatInstance=''

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

function App(){
  const[username,setUsername]=useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState('');
  const [sending, setSending] = useState(false);
 // const chatInstance = useRef(null);
  const [chatroom,setChatroom]=useState('1');
  const accounts = useRef(null);
  //popup
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
    //popup end
  function listenToNewMessages(){
    
    chatInstance.events.newMessage().on('data', async (evt) => {
      evt.returnValues.timestamp = new Date(evt.returnValues.timestamp * 1000);
      evt.returnValues.timestamp = `${evt.returnValues.timestamp.getDate()}.${evt.returnValues.timestamp.getMonth()+1}.${evt.returnValues.timestamp.getFullYear()} ${evt.returnValues.timestamp.getHours()}:${evt.returnValues.timestamp.getMinutes()}`
      let getUsername = await chatInstance.methods.getUsernameForAddress(evt.returnValues.fromAddress).call()
      if(getUsername===""){
        getUsername = `${evt.returnValues.fromAddress}`
      }
      setMessages((messages) => [...messages, { roomId: evt.returnValues.roomId, fromAddress: evt.returnValues.fromAddress, username: getUsername, message: evt.returnValues.message, timestamp: evt.returnValues.timestamp }])
      setSending(false);
    })
   
  } 
  useEffect(() => {
    async function Load(){
      try {
      const web3 = await getWeb3();

      

        // const networkId = await web3.eth.net.getId();//

        // chatInstance.current = new web3.eth.Contract(
        //   ChatContract.abi,
        //   ChatContract.networks[networkId] && ChatContract.networks[networkId].address,
        // );
  
        const contractAddress = "0x1EE27A9C1251E117DA267B17b448b871f8E7FA1F";//
        chatInstance = new web3.eth.Contract(abii, contractAddress);

      
        accounts.current = await web3.eth.getAccounts();
        if (accounts.current.size === 0) {
          console.log('empty');
        }
        setLoggedIn(accounts.current[0])  
    
        
        
        setLoading(false);  
        let messageCount = await chatInstance.methods.messageCount().call()
        

        if (messageCount >= 1) {
          for (let i = 0; i < messageCount; i++) {
            let new_message = await chatInstance.methods.messages(i).call();
            
            new_message.timestamp = new Date(new_message.timestamp * 1000);
            new_message.timestamp = `${new_message.timestamp.getDate()}.${new_message.timestamp.getMonth()+1}.${new_message.timestamp.getFullYear()} ${new_message.timestamp.getHours()}:${new_message.timestamp.getMinutes()}`
            
            let getUsername = await chatInstance.methods.getUsernameForAddress(new_message.fromAddress).call()
            //filter msg for room id 
            if (getUsername === "")
            {
              new_message.username = `${new_message.fromAddress}`
            }
            else{
              new_message.username=getUsername
            }
            setMessages((messages) => [...messages, new_message])
          }
        }
    
        listenToNewMessages();
    
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3 or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
    Load();

  } ,[]);

  
    
  
  function handleLogin(){
  }

  function changeUser(){
    chatInstance.methods.createUser(username).send({from:loggedIn});
    togglePopup();
  }  

  // //
  function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    if (message) {
      chatInstance.methods.addMessage(message, chatroom).send({ from: loggedIn });
       setMessage('');

    }
  }

  if (loading) {
    return (<div>
      <CircularIndeterminate />
      </div>
    );
  } else {
    return (
      <div className="App">
      <link href='https://fonts.googleapis.com/css?family=Yellowtail' rel='stylesheet'></link>

        <h1 style={{ color: "#2596be", fontFamily: "Yellowtail"}} >B l o c k c a s t</h1>
        <h5 style={{ color: "#be4d25" }} >ETHERIUM CHAT CLIENT DEPLOYED ON RINKEBY</h5>
        {!loggedIn ? (
          <Button style={ {top: '25%'} } variant="contained" >Login with MetaMask</Button>
        ) :
          (
            <>
              
              <CustomizedDialogs
                changeUser={changeUser}
                setUsername={setUsername}
                username={username}
              />
              <NativeSelectDemo
                setChatroom={setChatroom}
              />
              <div className="chat">
                <div className="chat-messages">
                  {messages.filter(function (m, i) {
                    console.log(m.roomId, chatroom)
                    return m.roomId === chatroom
                  }).map((m, i) => {
                    return (
                      <div className={m.fromAddress === loggedIn ? 'message-receiver' : 'message-sender'} key={'m' + i}>

                       <div className="message-info">{m.username} at {m.timestamp}</div> 
    
                        <div className="message-content">{m.message}</div>
                      </div>
                    )
                  })}
                  <AlwaysScrollToBottom/>
                </div>
              </div>
              <form className="message-input-wrapper" onSubmit={handleSubmit}>
                <input type="text" className="input" value={message} onChange={el => setMessage(el.target.value)} placeholder="Type Here" />
                <LoadingButton
                  onClick={handleSubmit}
                  endIcon={<SendIcon />}
                  loading={sending}
                  loadingPosition="end"
                  variant="outlined"
                >
                  Send
                </LoadingButton>
              </form>
            </>
          )}
      </div>
    );
  }
}


export default App;
