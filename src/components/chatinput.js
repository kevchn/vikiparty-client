import React from 'react'
import PropTypes from 'prop-types'

class ChatInput extends React.Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  }
  state = {
    message: '',
  }

  render() {
    return (
      <form
        action="."
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmitMessage(this.state.message)
          this.setState({ message: '' })
        }}
      >
        <input
          className="message-input"
          type="text"
          placeholder={'Send a message'}
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
        <input className="submit-input align-right" type="submit" value={'Send'} />
      </form>
    )
  }
}

export default ChatInput