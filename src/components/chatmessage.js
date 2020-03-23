import React from 'react'

function ChatMessage(props) {
  return (
    <div className='chat-message'>
      <strong className='colored'>{props.username}:&nbsp;</strong> {props.message}
    </div>
  );
}

export default ChatMessage