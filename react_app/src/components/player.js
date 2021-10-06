import React from 'react';
import '../assets/css/player.css'
import returnArrow from '../assets/images/return_button_arrow.png'

class Player extends React.Component {
    render() {
        const { lesson } = this.props;

        return <div className="player-container">
            <div className="player-top">
                <button
                    className="player-return-button"
                    onClick={() => this.props.onChangeWindow('home')}>
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
                <span className="player-video-text">5</span>
            </div>
        </div>;
    }
}

export default Player;