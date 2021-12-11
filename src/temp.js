import React, { useEffect, useState, useRef } from "react";
import getWeb3 from "./getWeb3";
import Particles from "react-tsparticles";
import Popup from './popup';
import { abii } from './contracts/abi.js'
import Button from '@mui/material/Button'
import CircularIndeterminate from './CircularIndeterminate'

import ChatContract from "./contracts/Chat.json";


import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';

import "./App.css";

let chatInstance = ''

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();
  useEffect(() => elementRef.current.scrollIntoView());
  return <div ref={elementRef} />;
};

function App(){
  const[username,setUsername]=useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState('');
  const [sending, setSending] = useState(false);
  const chatInstance = useRef(null);
  const [chatroom,setChatroom]=useState(0);
console.log(chatroom);
  const accounts = useRef(null);
  //popup
  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
    //popup end
  
  function listenToNewMessages(){
    
    chatInstance.current.events.newMessage().on('data', async (evt) => {
      evt.returnValues.timestamp = new Date(evt.returnValues.timestamp * 1000);
      evt.returnValues.timestamp = `${evt.returnValues.timestamp.getDate()}.${evt.returnValues.timestamp.getMonth()+1}.${evt.returnValues.timestamp.getFullYear()} ${evt.returnValues.timestamp.getHours()}:${evt.returnValues.timestamp.getMinutes()}`
      let getUsername = await chatInstance.current.methods.getUsernameForAddress(evt.returnValues.fromAddress).call()
      if(getUsername===""){
        getUsername = `${evt.returnValues.fromAddress}`
      }
      setMessages((messages) => [...messages, { fromAddress: evt.returnValues.fromAddress, username: getUsername, message: evt.returnValues.message, timestamp: evt.returnValues.timestamp }])
      setSending(false);
    })
   
  } 
  useEffect(() => {
    async function Load(){
      try {
      const web3 = await getWeb3();

     // const contractAddress = "0xa360dca4d24D0D5240a89aB26fA45f9e52DC2DE1";//
       // chatInstance = new web3.eth.Contract(abii, contractAddress);//

        const networkId = await web3.eth.net.getId();

        chatInstance.current = new web3.eth.Contract(
          ChatContract.abi,
          ChatContract.networks[networkId] && ChatContract.networks[networkId].address,
        );
  
      
        accounts.current = await web3.eth.getAccounts();
        if (accounts.current.size === 0) {
          console.log('empty');
        }
        setLoggedIn(accounts.current[0])  
    
        // contract instance.
    
      

        let messageCount = await chatInstance.current.methods.messageCount().call()
        

        if (messageCount >= 1) {
          for (let i = 0; i < messageCount; i++) {
            let new_message = await chatInstance.current.methods.messages(i).call();
            
            new_message.timestamp = new Date(new_message.timestamp * 1000);
            new_message.timestamp = `${new_message.timestamp.getDate()}.${new_message.timestamp.getMonth()+1}.${new_message.timestamp.getFullYear()} ${new_message.timestamp.getHours()}:${new_message.timestamp.getMinutes()}`
            
            let getUsername = await chatInstance.current.methods.getUsernameForAddress(new_message.fromAddress).call()
            
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
    
        setLoading(false);
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
    chatInstance.current.methods.createUser(username).send({from:loggedIn});
    
    togglePopup();
  }  

  // //
  function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    if (message) {
      chatInstance.current.methods.addMessage(message).send({ from: loggedIn });
      // console.log(messages);
       setMessage('');
       
      //  console.log(messages);

    }
  }

  if (loading) {
    return (<div>
        <Particles
          className="particles"
          id="tsparticles"
          options={{
    "background": {
        "color": {
        "value": "#000000"
        }
    },
    "fullScreen": {
        "zIndex": 1
    },
    "particles": {
        "color": {
        "value": "#ff0000",
        "animation": {
            "h": {
            "enable": true,
            "speed": 20
            }
        }
        },
        "links": {
        "color": {
            "value": "#ffffff"
        },
        "enable": true,
        "opacity": 0.4
        },
        "move": {
        "enable": true,
        "path": {},
        "outModes": {
            "bottom": "out",
            "left": "out",
            "right": "out",
            "top": "out"
        },
        "speed": 6,
        "spin": {}
        },
        "number": {
        "density": {
            "enable": true
        },
        "value": 80
        },
        "opacity": {
        "value": 0.5,
        "animation": {}
        },
        "size": {
        "value": {
            "min": 0.1,
            "max": 3
        },
        "animation": {}
        }
    }
        }}
        />  
      <CircularIndeterminate />
      </div>
    );
  } else {
    return (
      <div className="App">
      <Particles
          className="particles"
          id="tsparticles"
          options={{
    "background": {
        "color": {
        "value": "#000000"
        }
    },
    "fullScreen": {
        "zIndex": 1
    },
    "particles": {
        "color": {
        "value": "#ff0000",
        "animation": {
            "h": {
            "enable": true,
            "speed": 20
            }
        }
        },
        "links": {
        "color": {
            "value": "#ffffff"
        },
        "enable": true,
        "opacity": 0.4
        },
        "move": {
        "enable": true,
        "path": {},
        "outModes": {
            "bottom": "out",
            "left": "out",
            "right": "out",
            "top": "out"
        },
        "speed": 6,
        "spin": {}
        },
        "number": {
        "density": {
            "enable": true
        },
        "value": 80
        },
        "opacity": {
        "value": 0.5,
        "animation": {}
        },
        "size": {
        "value": {
            "min": 0.1,
            "max": 3
        },
        "animation": {}
        }
    }
        }}
        />

        

      <link href='https://fonts.googleapis.com/css?family=Yellowtail' rel='stylesheet'></link>

        <h1 style={{ color: "#ff9999", fontFamily: "Yellowtail"}} >B l o c k c a s t</h1>
        <h6 style={{ color: "#00FFFF" }} >ETHERIUM CHAT CLIENT DEPLOYED ON RINKEBY</h6>
        {!loggedIn ? (
          <Button style={ {top: '25%'} } variant="contained" >Login with MetaMask</Button>
        ) :
          (
            <>
            
              <Button
                style={{position: 'absolute', right: "40px", top: "20px"}}
                variant="outlined"
                color="error"
                onClick={togglePopup} > Change UserName </Button>
                {isOpen && <Popup
                content={
                  <div className="pop">
                    <b>Change Username</b>
                    <p>  Enter Username</p>
                    <input type="text"  value={username} onChange={el => setUsername(el.target.value)} placeholder="Type Here" />
                    <button onClick={changeUser}>Test button</button>
                  </div>
                }
                handleClose={togglePopup}
            />}
              <div className="chat">
                <div className="chat-messages">
                  {messages.map((m, i) => {
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
