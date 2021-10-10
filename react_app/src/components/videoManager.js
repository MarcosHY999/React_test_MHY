import React from 'react'
import Player from './player'
import LessonList from './lessonList'

class VideoManager extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            instructors: [],
            videoPlayList: [],
            completedLessons: [],
            isPlayListPlaying: false,
            playingVideo: undefined,
            videoInstructorName: "N/A",
        }

        this.addToVideoPlayList = this.addToVideoPlayList.bind(this)
        this.removeFromVideoPlayList = this.removeFromVideoPlayList.bind(this)
        this.playVideoPlayList = this.playVideoPlayList.bind(this)
        this.setVideoAsCompleted = this.setVideoAsCompleted.bind(this)
    }

    addToVideoPlayList(lesson, instructor) {
        let videoPlayList = this.state.videoPlayList.slice()
        let instructors = this.state.instructors.slice()
        videoPlayList.push(lesson)
        instructors.push(instructor)
        this.setState({
            videoPlayList,
            instructors
        })
    }

    removeFromVideoPlayList(id) {
        let videoPlayList = this.state.videoPlayList.slice()
        let instructors = this.state.instructors.slice()
        let index = -1
        for (let i = 0; i < videoPlayList.length; i++) {
            if (videoPlayList[i].id === id) {
                index = i
                break
            }
        }
        videoPlayList.splice(index, 1)
        instructors.splice(index, 1)
        this.setState({
            videoPlayList,
            instructors
        })
    }

    removeAllFromVideoPlayList() {
        this.setState({
            videoPlayList: [],
            instructors: []
        })
    }

    playVideoPlayList() {
        this.setState({
            isPlayListPlaying: true
        })
        this.playNextVideo()
        this.props.changeCurrentWindow("player")
    }

    stopVideoPlayList() {
        this.setState({
            isPlayListPlaying: false
        })
        this.props.changeCurrentWindow(this.props.lastWindow)
    }

    setVideoAsCompleted(id) {
        let completedLessons = this.state.completedLessons.slice()
        if (completedLessons.indexOf(id) === -1) {
            completedLessons.push(id)
            this.setState({
                completedLessons
            })
        }
        this.removeFromVideoPlayList(id)

        if (!this.props.isSubscribed) {
            if (!this.props.autoRenovation &&
                this.state.videoPlayList.length > 0) {
                this.props.changeCurrentWindow('subscription')
                this.stopVideoPlayList()
                return
            } else if (this.state.videoPlayList.length > 0) {
                this.props.startSubscription(this.props.subscriptionPlan)
            }
        }

        if (this.state.isPlayListPlaying) {
            this.playNextVideo()
        }
    }

    playNextVideo() {
        let videoPlayList = this.state.videoPlayList.slice()
        let instructors = this.state.instructors.slice()

        if (videoPlayList.length > 0) {
            this.setState({
                playingVideo: videoPlayList[0],
                videoInstructorName: instructors[0],
            })
        } else {
            this.stopVideoPlayList()
        }
    }

    setPlayingVideo = (lesson, videoInstructorName) => {
        this.setState({
            playingVideo: lesson,
            videoInstructorName
        })
        this.props.changeCurrentWindow('player')
    }

    render() {
        const { currentWindow } = this.props
        if (currentWindow === "lessonList") {
            return (<LessonList
                lessons={this.props.lessons}
                onPlayVideo={this.setPlayingVideo}
                addVideo={this.addToVideoPlayList}
                removeVideo={this.removeFromVideoPlayList}
                playPlayList={this.playVideoPlayList}
                completedLessons={this.state.completedLessons}
                selectedLessons={this.state.videoPlayList}
            />)
        } else if (currentWindow === "player") {
            return (<Player
                ref={this.playerRef}
                lesson={this.state.playingVideo}
                instructorName={this.state.videoInstructorName}
                setCompleted={this.setVideoAsCompleted}
                isPlayListPlaying={this.state.isPlayListPlaying}
                lastWindow={this.props.lastWindow}
                changeCurrentWindow={this.props.changeCurrentWindow}
            />)
        }
        return null
    }
}

export default VideoManager