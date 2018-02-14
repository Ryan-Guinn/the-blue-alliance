import React from 'react'
import PropTypes from 'prop-types'

import { getCompLevelStr, getMatchSetStr } from '../helpers'

class UpcomingMatchesTable extends React.PureComponent {
  state = {
    currentTime: undefined
  }

  componentDidMount() {
    this.updateCurrentTime()
    setInterval(this.updateCurrentTime, 10000)
  }

  updateCurrentTime = () => {
    this.setState({currentTime: new Date().getTime() / 1000})
  }

  render() {
    let matchRows = []
    this.props.matches.forEach(match => {
      let etaStr = '?'
      if (this.state.currentTime && match.predicted_time) {
        const etaMin = (match.predicted_time - this.state.currentTime) / 60
        if (etaMin < 5) {
          etaStr = '<5 min'
        } else {
          etaStr = `~${Math.round(etaMin)} min`
        }
      }

      const year = match.key.substring(0, 4)
      matchRows.push(
        <tr key={`${match.key}_red`}>
          <td rowSpan="2"><a href={`/match/${match.key}`}>{ getCompLevelStr(match) }<br/>{ getMatchSetStr(match) }</a></td>
          {match.alliances.red.team_keys.map(teamKey => {
            const teamNum = teamKey.substring(3)
            return <td key={ teamKey } className="red"><a href={ `/team/${ teamNum }/${ year }` }>{ teamNum }</a></td>
          })}
          <td rowSpan="2">{ etaStr }</td>
        </tr>
      )
      matchRows.push(
        <tr key={`${match.key}_blue`}>
          {match.alliances.blue.team_keys.map(teamKey => {
            const teamNum = teamKey.substring(3)
            return <td key={ teamKey } className="blue"><a href={ `/team/${ teamNum }/${ year }` }>{ teamNum }</a></td>
          })}
        </tr>
      )
    })

    return (
      <table className="match-table">
        <thead>
          <tr className="key">
            <th>Match</th>
            <th colSpan="3">Alliances</th>
            <th>ETA</th>
          </tr>
        </thead>
        <tbody>
          { matchRows }
        </tbody>
      </table>
    )
  }
}

UpcomingMatchesTable.propTypes = {
  matches: PropTypes.array.isRequired,
}

export default UpcomingMatchesTable
