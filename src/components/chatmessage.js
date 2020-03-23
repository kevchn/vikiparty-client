import React from 'react'

function ChatMessage(props) {
  return (
    <div class='chat-message'>
      <strong>{props.username}:</strong> <em>{props.message}</em>
    </div>
  );
}

export default ChatMessage