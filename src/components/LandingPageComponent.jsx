import React from 'react'
import { Link } from 'react-router-dom'

class LandingPageComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="landing-page row">

        <div className="entry-card col-md-8 offset-md-2 col-lg-4 offset-lg-4">
          <div className="log-in">
            <p>Already a Hero?</p>
            <div className="div-btn">
              <Link className="btn btn-dark" to='/heroes/login'>Let's Fight</Link>
            </div>
          </div>
          <div className="hr-line">
            <hr />
          </div>
          <div className="sign-up">
            <p>Create your own Hero!</p>
            <div className="div-btn">
              <Link className="btn btn-dark" to='/heroes/signup'>Join the league</Link>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default LandingPageComponent