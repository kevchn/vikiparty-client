import React from 'react'
import {Socket, Presence} from 'phoenix'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { v4 as uuidv4 } from 'uuid';

// const socket_url = "ws://localhost:4000/socket"
const socket_url = "ws://localhost:4000/socket"
class Title extends React.Component {
  state = {
    username: '',
    messages: [],
    members: []
  }
  messagesRef = React.createRef();

  componentDidMount() {
    // Generate random id 
    let murmur = uuidv4()
    console.log(murmur)

    // Connect to elixir socket
    let socket = new Socket(socket_url, {params: {user_id: murmur}})
    socket.onError(() => { this.connectionErrorCallback("server") })
    socket.connect()

    // Connect to elixir channel
    this.channel = socket.channel("room:lobby", {})
    this.channel.onError(() => { this.connectionErrorCallback("room") })
    this.channel.join()

    // Setup a listener on new messages from elixir channel
    this.channel.on("new_msg", payload => {
      this.setState({messages: this.state.messages.concat(payload)})
      if (!payload.is_cmd) {
        this.scrollToBottom()
      }
    })

    // Setup tracker for users that join/leave the room
    this.presence = new Presence(this.channel)
    this.presence.onSync(() => {
      this.setState({members: this.presence.list()})
    })

    // Set username
    this.setUsername()
  }

  scrollToBottom = () => {
    this.messagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  generateUsername = () => {
    let animals = ["alligator", "anteater", "armadillo", "auroch", "axolotl", "badger", "bat",
                   "beaver", "buffalo", "camel", "capybara", "chameleon", "cheetah",
                   "chinchilla", "chipmunk", "chupacabra", "cormorant", "coyote", "crow",
                   "dingo", "dinosaur", "dog", "dolphin", "dragon", "duck", "dumbo octopus",
                   "elephant", "ferret", "fox", "frog", "giraffe", "gopher", "grizzly",
                   "hedgehog", "hippo", "hyena", "jackal", "ibex", "ifrit", "iguana", "koala",
                   "kraken", "lemur", "leopard", "liger", "lion", "llama", "manatee", "mink",
                   "monkey", "narwhal", "nyan cat", "orangutan", "otter", "panda", "penguin",
                   "platypus", "pumpkin", "python", "quagga", "rabbit", "raccoon", "rhino",
                   "sheep", "shrew", "skunk", "slow loris", "squirrel", "tiger", "turtle",
                   "unicorn", "walrus", "wolf", "wolverine", "wombat"]
    let random_animal = animals[Math.floor(Math.random() * animals.length)]
    return "Anonymous " + random_animal
  }

  setUsername = () => {
    // todo: load username from Chrome storage if exists
    let message = {
      username: this.generateUsername()
    }
    this.channel.push("set_username", message)
  }

  changeUsername = () => {
    let message = {
      username: this.state.username,
    }
    this.channel.push("change_username", message)
  }

  submitMessage = messageString => {
    let message = {
      body: messageString,
    }
    this.channel.push("new_msg", message)
  }

  connectionErrorCallback = obj => {
    let message = {
      body: "Could not connect to the " + obj + ". Retrying.",
      is_local: true
    }
    this.setState({messages: this.state.messages.concat(message)})
  }

  render() {
    return (
      <div className='chat-container'>
        {/* Top Bar */}
        <div className="chat-header">
         <p className='align-left'>CHAT</p>
         <input
            type="text"
            className="username-input align-right"
            placeholder={'Enter your name'}
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
        <button className="submit-input align-right" onClick={this.changeUsername}>Change Username</button>
        </div>

        {/* Messages */}
        <div className="chat-log">
          {this.state.messages.map((message, index) =>
            <ChatMessage
              key={index}
              message={message.body}
              username={message.username}
              is_local={message.is_local}
              is_announcement={message.is_announcement}
              is_cmd={message.is_cmd}
              timestamp={message.timestamp}
            />
          )}
          <div ref={this.messagesRef}/>
        </div>

        {/* Input Area */}
        <div className="chat-footer">
          <ChatInput onSubmitMessage={this.submitMessage} />
        </div>
      </div>
    );
  }
}
  
export default Title;