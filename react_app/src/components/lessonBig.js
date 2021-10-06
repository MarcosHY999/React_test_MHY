import React from 'react';
import '../assets/css/lessonBig.css'
import { requestInstructorName } from '../requests'

const LEVEL_BALL_ACTIVE = '#b9b9b9';

class LessonBig extends React.Component {
    state = {
        instructorName: "N/A"
    }

    async componentDidMount() {
        let instructorName = await
            requestInstructorName(this.props.lesson.instructor_id)
        this.setState({
            instructorName
        })

    }

    getDate() {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];
        let date = new Date(this.props.lesson.published);
        return date.getDay() + " " + monthNames[date.getMonth()];
    }

    getDuration() {
        let duration = this.props.lesson.duration;
        return "Duración " + Math.round(duration / 60) + '\'';
    }

    getLevelBalls() {
        let res = [];
        for (let i = 0; i < 3; i++) {
            if (i < this.props.lesson.level) {
                res.push(<div
                    className="lessonb-ball"
                    key={"ball" + i}
                    style={{ backgroundColor: LEVEL_BALL_ACTIVE }} />);
            } else {
                res.push(<div
                    className="lessonb-ball"
                    key={"ball" + i} />)
            }
        }
        return (<React.Fragment>{res}</React.Fragment>)
    }


    render() {
        const { lesson } = this.props;

        return <div className="lessonb-container"
            onClick={() => this.props.onPlayVideo(lesson, this.state.instructorName)}>
            <div
                className="lessonb-top"
                style={{ backgroundImage: `url(${lesson.image})` }}>
                <span className="lessonb-title">{lesson.name}</span>
                <span className="lessonb-instructor">{this.state.instructorName}</span>
            </div>
            <div className="lessonb-bottom">
                <div className="lessonb-level">
                    <span className="lessonb-level-title">Nivel</span>
                    <div className="lessonb-level-balls">
                        {this.getLevelBalls()}
                    </div>
                </div>
                <span className="lessonb-date">{this.getDate()}</span>
                <span className="lessonb-duration">{this.getDuration()}</span>
            </div>

        </div>;
    }
}

export default LessonBig;