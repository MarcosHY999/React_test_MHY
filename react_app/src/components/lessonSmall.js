import React from 'react';
import logo from '../assets/images/logo_bc_2.png'
import '../assets/css/lessonSmall.css'
import { requestInstructorName } from '../requests'

class LessonSmall extends React.Component {
    state = {
        instructorName: "N/A"
    }

    async componentDidMount() {
        let instructorName = await
            requestInstructorName(this.props.lessonInfo.instructor_id)
        this.setState({
            instructorName
        })

    }

    getDate() {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];
        let date = new Date(this.props.lessonInfo.published);
        return date.getDay() + " " + monthNames[date.getMonth()] + " " + date.getFullYear();
    }

    render() {
        const { lessonInfo } = this.props;
        return (
            <div className="lesson-container"
                onClick={() => this.props.onPlayVideo(lessonInfo, this.state.instructorName)}>
                <div className="lesson-top">
                    <img src={logo} className="lesson-logo" />
                    <span className="lesson-date">{this.getDate()}</span>
                </div>
                <div className="lesson-box">
                    <span className="lesson-name">{lessonInfo.name}</span>
                    <span className="lesson-instructor">
                        {this.state.instructorName}
                    </span>
                </div>
            </div>);
    }
}

export default LessonSmall;