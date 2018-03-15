import React from 'react'
import history from '../history'
var NotificationSystem = require('react-notification-system');

class SignupComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      heroName: { value: '', isDirty: false },
      secretCode: { value: '', isDirty: false },
      secretCodeAgain: { value: '', isDirty: false },
      superPowers: { value: '', isDirty: false },
      powers: []
    }

    // This binding is necessary to make `this` work in the callback
    this.handleSignUp = this.handleSignUp.bind(this)
    this.handleAddPower = this.handleAddPower.bind(this)
    this.handleRemovePower = this.handleRemovePower.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
  }

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

  // Handle add power
  handleAddPower = (e) => {
    if (e.key === 'Enter' && this.state.powers.length < 4 && this.state.superPowers.value.length > 0) {
      this.setState({ powers: [...this.state.powers, this.state.superPowers.value], superPowers: Object.assign({}, this.state.superPowers, { value: '' }) })
    }
  }

  // Handle add power
  handleRemovePower = (power) => {
    const index = this.state.powers.find(item => item === power)
    let powers = this.state.powers
    powers.splice(index, 1)
    this.setState({ powers: powers })
  }

  // Handle SignUp button click
  handleSignUp = () => {
    if (this.state.heroName.value.length === 0) {
      this.setState({ heroName: Object.assign({}, this.state.heroName, { isDirty: true }) })
      return
    }
    if (this.state.secretCode.value.length === 0) {
      this.setState({ secretCode: Object.assign({}, this.state.secretCode, { isDirty: true }) })
      return
    }
    fetch('/v1/signup', {
      method: 'POST',
      body: JSON.stringify({ account: this.state.heroName.value, pass: this.state.secretCode.value, powers: this.state.powers }),
      credentials: "same-origin"
    }).then(response => {
      response.json().then(data => {
        if (response.status >= 400) {
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
    }).catch(exception => {
      console.log('Error', exception);
    })
  }
  render() {
    return (
      <div className="create-hero row">
        <NotificationSystem ref={(element) => { this.notificationSystem = element; }} />
        <div className="create-card col-md-8 offset-md-2 col-lg-4 offset-lg-4">
          <div className="create-form">
            <div className="card-title">
              <p>Let's save the World!</p>
            </div>
            <form>
              <div className="column">
                <div className="col hero-name">
                  <input className="form-control form-control-lg" type="text" placeholder="Choose a name  e.g - Flash" name="heroName" value={this.state.heroName.value} onChange={this.handleChange} onBlur={this.handleBlur} />
                  <div className="invalid-feedback" style={{ display: (this.state.heroName.isDirty && this.state.heroName.value.length === 0) ? 'inherit' : 'none' }}>Minimum 4 characters required for Hero's name</div>
                  <small className="form-text text-muted">The name explains it all</small>
                </div>
                <div className="col identity">
                  <input className="form-control form-control-lg" type="password" placeholder="Create a secret code" name="secretCode" value={this.state.secretCode.value} onChange={this.handleChange} onBlur={this.handleBlur} />
                  <div className="invalid-feedback" style={{ display: (this.state.secretCode.isDirty && this.state.secretCode.value.length === 0) ? 'inherit' : 'none' }}>Heroes should not have secret codes smaller than 4 letters</div>
                  <br />
                  <input className="form-control form-control-lg" type="password" placeholder="Confirm the secret code" name="secretCodeAgain" value={this.state.secretCodeAgain.value} onChange={this.handleChange} onBlur={this.handleBlur} />
                  <div className="invalid-feedback" style={{ display: (this.state.secretCodeAgain.isDirty && this.state.secretCode.value !== this.state.secretCodeAgain.value) ? 'inherit' : 'none' }}>{(this.state.secretCodeAgain.isDirty && this.state.secretCodeAgain.value.length === 0 && this.state.secretCode.value !== this.state.secretCodeAgain.value) ? 'Type secret code again' : 'Secret codes are not matching'}</div>
                </div>
                <div className="col hr-line">
                  <hr />
                </div>
                <div className="col choose-super">
                  <div className="card2-title">
                    <p>It's time to get your superpowers!</p>
                  </div>
                  <input className="form-control form-control-lg" type="text" placeholder="SuperHuman Strength" name="superPowers" value={this.state.superPowers.value} onKeyDown={this.handleAddPower} onChange={this.handleChange} onBlur={this.handleBlur} />
                  <div className="invalid-feedback" style={{ display: (this.state.superPowers.isDirty && this.state.superPowers.value.length === 0 && this.state.powers.length === 0) ? 'inherit' : 'none' }}>Super Hero needs atleast one Super Power</div>
                  <small className="form-text text-muted" id="textPower" style={{ fontStyle: 'italic' }}>{(this.state.powers.length === 4) ? 'Super hero is fully charged' : 'Choose upto 4 powers'}</small>
                </div>
                <div className="chips" id="chips">
                  {this.state.powers.map((power, index) => <div key={index} className="chip"><span>{power}</span><i className="material-icons" onClick={(e) => this.handleRemovePower(power)}>close</i></div>)}
                </div>
                <div className="div-btn">
                  <a type="button" className="btn btn-dark" onClick={this.handleSignUp}>Join the League</a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    )
  }
}

export default SignupComponent

