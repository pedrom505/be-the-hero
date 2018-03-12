import React from 'react'
import { Link } from 'react-router-dom'
import history from '../history'
var NotificationSystem = require('react-notification-system');
const trophyImage = require('../img/trophy.png')
const alienImage = require('../img/alien.png')
const waitingEmoji = require('../img/emoji_waiting.png')

const groupBy = function (array, prop) {
  return array.reduce(function (groups, item) {
    var val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
}

class HomeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      powers: [],
      upvotedByMe: [],
      heroes: []
    }

    // This binding is necessary to make `this` work in the callback
    this.handleUpvote = this.handleUpvote.bind(this)
    this.logout = this.logout.bind(this)

    fetch('/v1/fetch-data', {
      method: 'GET',
      credentials: "same-origin"
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (!data.ack) {
        this.notificationSystem.addNotification({
          title: 'Error',
          message: data.error,
          level: 'error'
        })
        return
      }
      const byHeroes = groupBy(data.heroes, 'account')
      let heroes = []
      for (var key in byHeroes) {
        if (byHeroes.hasOwnProperty(key)) {
          heroes.push({
            account: key,
            powers: byHeroes[key].map(obj => {
              return {
                power: obj.power,
                upvoted: data.upvotes.find(item => item.account === key && item.power === obj.power) ? true : false
              }
            }),
            upvotes: byHeroes[key].reduce((prev, curr) => { return prev + curr.sum }, 0)
          })
        }
      }
      this.setState({ account: data.account, powers: data.powers, upvotedByMe: data.upvotes, heroes: heroes.filter(obj => obj.account !== data.account) })
    }).catch(exception => {
      console.log('Error', exception);
    })
  };

  handleUpvote = (account, power, upvoted) => {
    const action = upvoted ? 'downvote' : 'upvote'
    let heroes = this.state.heroes
    const index = heroes.findIndex(obj => obj.account === account)
    if (index !== -1) {
      let powers = heroes[index].powers
      const subIndex = powers.findIndex(obj => obj.power === power)
      if (subIndex !== -1) {
        heroes[index].powers[subIndex].upvoted = !upvoted
        heroes[index].upvotes = upvoted ? (heroes[index].upvotes - 1) : (heroes[index].upvotes + 1)
        this.setState({ heroes: heroes })
        fetch('/v1/' + action + '/' + account + '/' + power, {
          method: 'POST',
          body: JSON.stringify({}),
          credentials: "same-origin"
        }).then((response) => {
          return response.json()
        }).then((data) => {
          if (!data.ack) {
            this.notificationSystem.addNotification({
              title: 'Error',
              message: data.error,
              level: 'error'
            })
            heroes[index].powers[subIndex].upvoted = upvoted
            heroes[index].upvotes = upvoted ? (heroes[index].upvotes + 1) : (heroes[index].upvotes - 1)
            this.setState({ heroes: heroes })
          }
        }).catch(exception => {
          console.log('Error', exception);
        })
      }
    }
  }

  logout = () => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }

    history.replace('/')
  }
  render() {
    return (
      <div className="home-page row">
        <NotificationSystem ref={(element) => { this.notificationSystem = element; }} />
        <div className="modal fade" id="logout-modal" tabIndex="-1" role="dialog" aria-labelledby="logout-modalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="logout-modalLabel">Sometimes, the hero needs a break!</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">No way!</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.logout}>Yes Logout</button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="profile-modal" tabindex="-1" role="dialog" aria-labelledby="profile-modalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title" id="profile-modalLabel">{this.state.account}</h3>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="chips">
                  {this.state.powers.map((obj, index) => <div key={index} className="chip no-hover">{(obj.sum > 0) ? obj.power + ' - ' + obj.sum : obj.power}</div>)}
                </div>
                <div className="power-points">
                  <p> <img src={trophyImage} /> {this.state.powers.reduce((prev, curr) => { return prev + curr.sum }, 0)}</p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
        <div className="leaderboard col-md-10 offset-md-1 col-lg-6 offset-lg-3">
          <div className="card-title">
            <img src={alienImage} className="rounded-1" alt="" data-toggle="modal" data-target="#profile-modal" />
            <p>SpaceUp Heroes</p>
            <img src={waitingEmoji} className="rounded-2" alt="" data-toggle="modal" data-target="#logout-modal" />
          </div>
          <div className="col hr-line">
            <hr />
          </div>
          <div className="ranking-cards column">
            {this.state.heroes.map((obj, index) =>
              <div key={index} className="user-card">
                <div className="power-points">
                  <p className="hero-name">{obj.account}</p>
                  <p> <img src={trophyImage} /> {obj.upvotes}</p>
                </div>
                <div className="chips">
                  {obj.powers.map((power, index) => <div key={index} className={power.upvoted ? 'chip upvoted' : 'chip'} onClick={() => this.handleUpvote(obj.account, power.power, power.upvoted)}>{power.power}</div>)}
                </div>
              </div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default HomeComponent