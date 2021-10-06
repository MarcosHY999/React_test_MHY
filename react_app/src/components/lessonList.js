import React from 'react';
import LessonBig from './lessonBig'
import '../assets/css/lessonList.css'
import playButton from '../assets/images/play_button.png'

class LessonList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedVideos: 0,
        }
        this.removeVideo = this.removeVideo.bind(this)
        this.addVideo = this.addVideo.bind(this)
    }

    renderAllLessons() {
        let newlessons = this.props.lessons.slice()
        return (
            <React.Fragment>
                {newlessons.reverse().map(lesson => {
                    let completed = this.props.completedLessons.indexOf(lesson.id) !== -1;
                    return (
                        <LessonBig
                            isCompleted={completed}
                            addVideo={this.addVideo}
                            removeVideo={this.removeVideo}
                            key={lesson.id}
                            lesson={lesson}
                            onPlayVideo={this.props.onPlayVideo} />
                    )
                })}
            </React.Fragment>)
    }

    renderPlayListButton() {
        if (this.state.selectedVideos > 0) {
            return (
                <div
                    className="lesson-list-button"
                    onClick={this.props.playPlayList}>
                    <img src={playButton} className="lesson-list-button-image"></img>
                    <span className="lesson-list-button-text">REPRODUCIR AUTOMÁTICAMENTE</span>
                </div>)
        } else {
            return (
                <div style={{ opacity: "50%" }} className="lesson-list-button">
                    <img src={playButton} className="lesson-list-button-image"></img>
                    <span className="lesson-list-button-text">REPRODUCIR AUTOMÁTICAMENTE</span>
                </div>)
        }
    }

    addVideo(lesson, instructor) {
        this.setState({
            selectedVideos: this.state.selectedVideos + 1
        })
        this.props.addVideo(lesson, instructor)
    }

    removeVideo(id) {
        this.setState({
            selectedVideos: this.state.selectedVideos - 1
        })
        this.props.removeVideo(id)
    }

    render() {
        return (
            <div className="lesson-list-container">
                {this.renderPlayListButton()}
                <div className="lesson-list-element-list" >
                    {this.renderAllLessons()}
                </div>
            </div>);
    }
}

export default LessonList;