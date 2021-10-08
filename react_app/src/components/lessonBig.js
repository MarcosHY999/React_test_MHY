import React from 'react';
import '../assets/css/lessonBig.css'
import { requestInstructorName } from '../requests'
import check from '../assets/images/check.png'

const LEVEL_BALL_ACTIVE = '#b9b9b9';

class LessonBig extends React.Component {
    state = {
        instructorName: "N/A",
        isSelected: this.props.isSelected,
        loading: true,
    }

    async componentDidMount() {
        let instructorName = await
            requestInstructorName(this.props.lesson.instructor_id)
        this.setState({
            instructorName,
            loading: false,
        })
    }

    getDate() {
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
        ];
        let date = new Date(this.props.lesson.published);
        return date.getDate() + " " + monthNames[date.getMonth()];
    }

    getDuration() {
        let duration = this.props.lesson.duration;
        return "Duración " + Math.round(duration / 60) + '\'';
    }

    renderLevelBalls() {
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

    renderCheckBox() {
        if (!this.state.isSelected)
            return (
                <React.Fragment>
                    <div className="lessonb-top-checkbox-unselected"
                        onClick={(e) => this.toogleSelection(e)}
                    />
                </React.Fragment>
            )
        else {
            return (
                <React.Fragment>
                    <div className="lessonb-top-checkbox-selected"
                        onClick={(e) => this.toogleSelection(e)}
                        style={{ backgroundImage: `url(${check})` }}
                    />
                </React.Fragment>)
        }
    }

    renderCompletedTag() {
        if (this.props.isCompleted) {
            return <span className="lessonb-completed">Completada</span>;
        }
    }

    toogleSelection(e) {
        e.stopPropagation();
        if (this.state.isSelected) {
            this.props.removeVideo(this.props.lesson.id)
        } else {
            this.props.addVideo(this.props.lesson, this.state.instructorName)
        }
        this.setState({
            isSelected: !this.state.isSelected
        });
    }


    render() {
        if (!this.state.loading) {
            const { lesson } = this.props;
            return <div className="lessonb-container"
                onClick={() => this.props.onPlayVideo(lesson, this.state.instructorName)}>
                <div
                    className="lessonb-top"
                    style={{ backgroundImage: `url(${lesson.image})` }}>
                    {this.renderCheckBox()}
                    <div className="lessonb-top-text">
                        <span className="lessonb-title">{lesson.name}</span>
                        <span className="lessonb-instructor">{this.state.instructorName}</span>
                        {this.renderCompletedTag()}
                    </div>
                </div>
                <div className="lessonb-bottom">
                    <div className="lessonb-level">
                        <span className="lessonb-level-title">Nivel</span>
                        <div className="lessonb-level-balls">
                            {this.renderLevelBalls()}
                        </div>
                    </div>
                    <span className="lessonb-date">{this.getDate()}</span>
                    <span className="lessonb-duration">{this.getDuration()}</span>
                </div>
            </div>;
        }
        return (<React.Fragment />)
    }
}

export default LessonBig;