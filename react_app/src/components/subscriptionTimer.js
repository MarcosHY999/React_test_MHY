import React from 'react'
import '../assets/css/subscriptionTimer.css'

class SubscriptionTimer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timerStart: this.props.startTime,
            timerLeft: 0,
        }
        this.timer = undefined
        this.countDown = this.countDown.bind(this)
    }

    componentDidMount() {
        this.startTimer()
    }

    componentWillUnmount() {
        if (this.timer !== undefined) clearInterval(this.timer)
    }

    startTimer() {
        this.setState({
            timerLeft: this.state.timerStart
        })

        this.timer = setInterval(this.countDown, 1000)
    }

    countDown() {
        let timerLeft = this.state.timerLeft - 1
        this.setState({
            timerLeft
        })

        if (timerLeft === 0) {
            clearInterval(this.timer)
            this.subscriptionEnded()
        }
    }

    getTimerValue() {
        let time = this.state.timerLeft
        return Math.floor(time / 60) +
            ":" + this.toTwoDigits((time % 60))
    }

    toTwoDigits(n) {
        return n > 9 ? "" + n : "0" + n
    }

    subscriptionEnded() {
        this.props.endSubscription()
    }

    render() {
        return <div className="subscription-timer-container"
            onClick={() => this.props.changeCurrentWindow('subscription')}>
            <span className="subscription-timer-text">SUSCRIPCIÓN</span>
            <span className="subscription-timer-value">{this.getTimerValue()}</span>
        </div>
    }
}

export default SubscriptionTimer
