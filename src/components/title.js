import React from 'react'
// import {Socket} from 'phoenix-channels'
import {Socket, Presence} from 'phoenix'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Fingerprint2 from 'fingerprintjs2'

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
    // Generate browser canvas fingerprint
    Fingerprint2.get(components => {
      let values = components.map(function (component) { return component.value })
      let murmur = Fingerprint2.x64hash128(values.join(''), 31)
      console.log("Browser fingerprint: " + murmur)

      // Connect to elixir socket
      let socket = new Socket(socket_url, {params: {user_id: murmur}})
      socket.onError(() => { this.connectionErrorCallback("server") })
      socket.connect()

      // Connect to elixir channel
      this.channel = socket.channel("room:lobby", {})
      this.channel.onError(() => { this.connectionErrorCallback("room") })
      this.channel.join().receive("ok", this.connectionSuccessCallback)

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

      this.presence.onJoin((id, current, newPres) => {
        if (!current && id != murmur) {
          let message = {
            body: "has joined!",
            is_local: true
          }
          this.setState({messages: this.state.messages.concat(message)})
        }
      })

      this.presence.onLeave((id, current, leftPres) => {
        console.log("someone left")
      })
    })
  }

  scrollToBottom = () => {
    this.messagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  submitMessage = messageString => {
    let message = {
      body: messageString,
    }
    this.channel.push("new_msg", message)
  }

  changeUsername = () => {
    let message = {
      username: this.state.username,
    }
    this.channel.push("change_username", message)
  }

  connectionSuccessCallback = () => {
    let message = {
      body: "You have connected to the room as " + this.state.username + '.',
      is_local: true
    }
    this.setState({messages: this.state.messages.concat(message)})
  }

  connectionErrorCallback = obj => {
    let message = {
      body: "Could not connect to the " + obj + ". Retrying.",
      is_local: true
    }
    this.setState({messages: this.state.messages.concat(message)})
  }

    // Google's "Anonymous Animals" has only 73 animals. They don't care about
    // 74+ person chat rooms because it is so rare.

    // Suppose we generate usernames of the form: CVCVC, where C = consonant, V
    // = vowel. The cardinality of the result set is 21*5*21*5*21 = 231525.
    // Suppose we have a 73 person chat room, where each person retrieves a
    // random name from this set. The probability of no collisions is ~98.9%.
    // For a 10 person chat room, this probability becomes ~99.98%.

    // See calculation and result at:
    // https://www.wolframalpha.com/input/?i=231525%21+%2F+%28231525-73%29%21%29%2F%28231525%5E73%29


  render() {
    return (
      <div className='chat-container'>
        {/* Top Bar */}
        <div>
          {this.state.members.map((item, index) => (
            <li key={index}>{item.metas[0]['username']}</li>
          ))}
        </div>
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