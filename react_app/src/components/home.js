import React, { Component } from 'react';
import ubicationMarker from '../assets/images/ubication_marker.png'
import '../assets/css/home.css'
import LessonSmall from './lessonSmall';

class Home extends React.Component {
    constructor(props) {
        super(props);
        const { user } = this.props
        this.state = {
            userInfo: [
                { name: 'NIVEL', value: user.level },
                { name: 'CONSTANCIA', value: user.perseverance },
                { name: 'PUNTOS', value: user.total_points }
            ],
            userStats: [
                { color: '#fcd900', name: 'Resistencia', value: user.stamina_points },
                { color: '#f13b46', name: 'Fuerza', value: user.strength_points },
                { color: '#69ae00', name: 'Flexibilidad', value: user.flexiblity_points },
                { color: '#1d8cb9', name: 'Mente', value: user.mind_points }
            ],
        }
    }


    renderUserInfo() {
        return (
            <React.Fragment>
                {this.state.userInfo.map(info => (
                    <div className="user-info-element">
                        <div className="element-value">{info.value}</div>
                        <div className="element-name">{info.name}</div>
                    </div>))}
            </React.Fragment>)
    }

    renderUserStats() {
        return (
            <React.Fragment>
                {this.state.userStats.map(stat => (
                    <div className="user-stat">
                        <div className="stat-value"
                            style={{ backgroundColor: stat.color }} >
                            {stat.value}</div>
                        <div className="stat-name">{stat.name}</div>
                    </div>))}
            </React.Fragment>)
    }

    renderLastLessons() {
        return (
            <React.Fragment>
                {this.props.lessons.map(lesson => (
                    <LessonSmall
                        lessonInfo={lesson}
                        onPlayVideo={this.props.onPlayVideo} />
                ))}
            </React.Fragment>)
    }

    render() {
        const { user } = this.props
        return (
            <div className="home-container">
                <div className="user-info">
                    <img className="user-info-image" src={user.avatar}></img>
                    <div className="user-info-section">
                        <div className="user-info-name">{user.name}</div>
                        <img className="user-info-ubi-marker" src={ubicationMarker}></img>
                    </div>
                </div>
                <div className="user-info-2">
                    {this.renderUserInfo()}
                </div>
                <div className="user-stats-points">
                    {this.renderUserStats()}
                </div>
                <div className="last-lessons">
                    <div className="last-lessons-top">
                        <span className="last-lessons-title">ÚLTIMAS CLASES</span>
                        <button
                            className="last-lessons-button"
                            onClick={() => this.props.onChangeWindow('lessonList')}
                        >VER TODAS</button>
                    </div>
                    <ul className="last-lessons-list">
                        {this.renderLastLessons()}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Home;