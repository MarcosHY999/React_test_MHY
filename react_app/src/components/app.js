import React from 'react';
import '../assets/css/app.css';
import logoTop from '../assets/images/logo_bc.png'
import Home from './home'
import LessonList from './lessonList'
import Player from './player'
import { requestUserProfile, requestLessons } from '../requests.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentWindow: 'home',
            lastWindow: 'home',
            user: undefined,
            lessons: [],
            loading: true,
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


    async componentDidMount() {
        await this.initializeData()
        this.setState({
            loading: false
        })
    }

    async initializeData() {
        let user = await requestUserProfile()
        let lessons = await requestLessons()
        this.setState({
            user,
            lessons
        })
    }

    getLastLessons() {
        let lessons = this.state.lessons;
        return lessons.slice(lessons.length - 9).reverse()
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
        this.setCurrentWindow("player")
    }

    stopVideoPlayList() {
        this.setState({
            isPlayListPlaying: false
        })
        this.setCurrentWindow(this.state.lastWindow)
    }

    setVideoAsCompleted(id) {
        let completedLessons = this.state.completedLessons.slice()
        if (completedLessons.indexOf(id) === -1) {
            completedLessons.push(id)
            this.setState({
                completedLessons
            })
        }
        if (this.state.isPlayListPlaying) {
            this.removeFromVideoPlayList(id)
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

    renderCurrentWindow() {
        if (!this.state.loading) {
            switch (this.state.currentWindow) {
                case 'home':
                default:
                    return (<Home
                        onChangeWindow={this.setCurrentWindow}
                        onPlayVideo={this.setPlayingVideo}
                        user={this.state.user}
                        lessons={this.getLastLessons()} />)

                case 'lessonList':
                    return (<LessonList
                        lessons={this.state.lessons}
                        onPlayVideo={this.setPlayingVideo}
                        addVideo={this.addToVideoPlayList}
                        removeVideo={this.removeFromVideoPlayList}
                        playPlayList={this.playVideoPlayList}
                        completedLessons={this.state.completedLessons} />)

                case 'player':
                    return (<Player
                        ref={this.playerRef}
                        lesson={this.state.playingVideo}
                        lastWindow={this.state.lastWindow}
                        instructorName={this.state.videoInstructorName}
                        setCompleted={this.setVideoAsCompleted}
                        onChangeWindow={this.setCurrentWindow}
                        isPlayListPlaying={this.state.isPlayListPlaying}
                    />)
            }
        }
    }

    setCurrentWindow = currentWindow => {
        if (currentWindow !== 'player') {
            this.removeAllFromVideoPlayList()
        }
        this.setState({
            lastWindow: this.state.currentWindow,
            currentWindow
        })
    }

    setPlayingVideo = (lesson, videoInstructorName) => {
        this.setState({
            playingVideo: lesson,
            videoInstructorName
        })
        this.setCurrentWindow('player')
    }

    render() {
        return (
            <div className="app">
                <div className="top-bar">
                    <img className="top-bar-logo"
                        src={logoTop}
                        onClick={() => this.setCurrentWindow('home')}></img>
                </div>
                <main className="container">
                    {this.renderCurrentWindow()}
                </main>
            </div>
        );
    }
}
export default App;
