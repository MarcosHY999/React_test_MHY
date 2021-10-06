import React from 'react';
import LessonBig from './lessonBig'
import '../assets/css/lessonList.css'

class LessonList extends React.Component {
    renderAllLessons() {
        let newlessons = this.props.lessons.slice()
        return (
            <React.Fragment>
                {newlessons.reverse().map(lesson => (
                    <LessonBig
                        key={lesson.id}
                        lesson={lesson}
                        onPlayVideo={this.props.onPlayVideo} />
                ))}
            </React.Fragment>)
    }

    render() {
        return <ul className="lesson-list" >
            {this.renderAllLessons()}
        </ul>;
    }
}

export default LessonList;