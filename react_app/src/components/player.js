import React from 'react';
import '../assets/css/player.css'
import returnArrow from '../assets/images/return_button_arrow.png'

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timerStart: 5,
            timerLeft: 5,
            lastLessonId: this.props.lesson.id,
            lastWindow: this.props.lastWindow
        }
        this.timer = undefined;
        this.countDown = this.countDown.bind(this)
    }

    componentDidMount() {
        this.startTimer()
    }

    componentDidUpdate() {
        let lessonId = this.props.lesson.id
        if (this.state.lastLessonId !== lessonId) {
            this.setState({
                lastLessonId: lessonId
            })
            this.startTimer();
        }
    }

    componentWillUnmount() {
        if (this.timer !== undefined) clearInterval(this.timer)
    }

    startTimer() {
        this.setState({
            timerLeft: this.state.timerStart
        })

        this.timer = setInterval(this.countDown, 1000);
    }

    countDown() {
        let timerLeft = this.state.timerLeft - 1;
        this.setState({
            timerLeft
        })

        if (timerLeft === 0) {
            clearInterval(this.timer);
            this.completeAndReturn()
        }
    }

    completeAndReturn() {
        this.props.setCompleted(this.props.lesson.id)
        if (!this.props.isPlayListPlaying) {
            this.returnToLastWindow();
        }
    }

    returnToLastWindow() {
        this.props.onChangeWindow(this.state.lastWindow);
    }

    render() {
        const { lesson } = this.props;
        return <div className="player-container">
            <div className="player-top">
                <button
                    className="player-return-button"
                    onClick={() => this.returnToLastWindow()}>
                    <img className="player-return-button-image" src={returnArrow} />
                </button>
                <div className="player-top-info">
                    <span className="player-top-title">{lesson.name}</span>
                    <span className="player-top-instructor">
                        {this.props.instructorName}
                    </span>
                </div>
            </div>
            <div className="player-video">
                <span>{this.state.timerLeft}</span>
            </div>
        </div>;
    }
}

export default Player;