import React from 'react'

function ChatMessage(props) {
  return (
    <p>
      <strong>{props.username}</strong> <em>{props.message}</em>
    </p>
  );
}

export default ChatMessage