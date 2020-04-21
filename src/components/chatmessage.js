import React from 'react'

function ChatMessage(props) {
  let date = new Date(props.timestamp)
  let formattedTimestamp = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  if (props.is_cmd) {
    return (
      <div className='chat-message'>
        [{formattedTimestamp}]&nbsp;<em>{props.username}&nbsp;clicked&nbsp;{props.message}</em>
      </div>
    );
  }
  else if (props.is_local) {
    return (
      <div className='chat-message'>
        {props.message}
      </div>
    );
  }
  else if (props.is_announcement) {
    return (
    <div className='chat-message'>
      <span>
        <strong className='colored'>{props.username}</strong>
        &nbsp;
        <i className='greyed'>{formattedTimestamp}</i>
      <br/>
        <i className='greyed'>{props.message}</i>
      </span>
    </div>
    );
  }
  else return (
    <div className='chat-message'>
      <span>
        <strong className='colored'>{props.username}</strong>
        &nbsp;
        <i className='greyed'>{formattedTimestamp}</i>
      <br/>
        {props.message}
      </span>
    </div>
  );
}

export default ChatMessage