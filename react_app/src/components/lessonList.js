import React, { Component } from 'react';
import LessonBig from './lessonBig'
import '../assets/css/lessonList.css'

class LessonList extends React.Component {
    renderAllLessons() {
        let newlessons = this.props.lessons.slice()
        return (
            <React.Fragment>
                {newlessons.reverse().map(lesson => (
                    <LessonBig
                        lesson={lesson}
                        onPlayVideo={this.props.onPlayVideo} />
                ))}
            </React.Fragment>)
    }

    render() {
        return <div className="lesson-list" >
            {this.renderAllLessons()}
        </div>;
    }
}

export default LessonList;