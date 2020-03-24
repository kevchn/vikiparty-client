import React from 'react'

function ChatMessage(props) {
  let date = new Date(props.timestamp)
  let formattedTimestamp = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  if (props.is_announcement) {
    return (
      <div className='chat-message'>
        [{formattedTimestamp}]&nbsp;A user has joined! (mandatory name selection unenforced)
      </div>
    );
  }
  else if (props.is_cmd) {
    return (
      <div className='chat-message'>
        [{formattedTimestamp}]&nbsp;<em>{props.username}&nbsp;clicked&nbsp;{props.message}</em>
      </div>
    );
  }
  return (
    <div className='chat-message'>
      [{formattedTimestamp}]&nbsp;<strong className='colored'>{props.username}:&nbsp;</strong> {props.message}
    </div>
  );
}

export default ChatMessage