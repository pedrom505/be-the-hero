import React from 'react'
import history from '../history'
var NotificationSystem = require('react-notification-system');

class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heroName: { value: '', isDirty: false },
      secretCode: { value: '', isDirty: false }
    }

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  };

  // Handle input change
  handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    this.setState({ [name]: Object.assign({}, this.state[name], { value: value, isDirty: true }) })
  }

  // Handle blur change
  handleBlur = (e) => {
    const name = e.target.name
    this.setState({ [name]: Object.assign({}, this.state[name], { isDirty: true }) })
  }


  // Handle login button click
  handleClick = () => {

    if (this.state.heroName.value.length === 0) {
      this.setState({ heroName: Object.assign({}, this.state.heroName, { isDirty: true }) })
      return
    }
    if (this.state.secretCode.value.length === 0) {
      this.setState({ secretCode: Object.assign({}, this.state.secretCode, { isDirty: true }) })
      return
    }
    fetch('v1/login', {
      method: 'POST',
      body: JSON.stringify({ account: this.state.heroName.value, pass: this.state.secretCode.value }),
      credentials: "same-origin"
    }).then(response => {
      return response.json()
    }).then(data => {
      if (!data.ack) {
        this.notificationSystem.addNotification({
          title: 'Error',
          message: data.error,
          level: 'error'
        })
        return
      }
      history.push('/home')
    }).catch(exception => {
      console.log('Error', exception);
    })
  }
  render() {
    return (
      <div className="login-page row">
        <NotificationSystem ref={(element) => { this.notificationSystem = element; }} />
        <div className="login-card col-md-8 offset-md-2 col-lg-4 offset-lg-4">
          <div className="col-sm card-title">
            <p>The world is on fire!</p>
          </div>
          <div className="col-sm login-form">
            <input className="form-control" type="text" placeholder="Name of Superhero" name="heroName" value={this.state.heroName.value} onChange={this.handleChange} onBlur={this.handleBlur} />
            <div className="invalid-feedback" style={{ display: (this.state.heroName.isDirty && this.state.heroName.value.length === 0) ? 'inherit' : 'none' }}>Name of Superhero is required</div>
            <br />
            <input className="form-control" type="password" placeholder="Secret code" name="secretCode" value={this.state.secretCode.value} onChange={this.handleChange} onBlur={this.handleBlur} />
            <div className="invalid-feedback" style={{ display: (this.state.secretCode.isDirty && this.state.secretCode.value.length === 0) ? 'inherit' : 'none' }}>Secret code is required</div>
            <br />
            <div className="div-btn">
              <button onClick={this.handleClick} className="btn btn-dark">Let's Fight</button>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default LoginComponent