import React from 'react';
import '../assets/css/app.css';
import logoTop from '../assets/images/logo_bc.png'
import Home from './home'
import LessonList from './lessonList'
import Player from './player'
import Subscription from './subscription';
import SubscriptionTimer from './subscriptionTimer';
import {
    requestUserProfile, requestLessons,
    requestCreateSubscription, requestSubscriptionTime
} from '../requests.js'

const USER_ID = 1

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentWindow: 'home',
            lastWindow: 'home',
            user: undefined,
            lessons: [],
            loading: true,

            //playlists and player
            instructors: [],
            videoPlayList: [],
            completedLessons: [],
            isPlayListPlaying: false,
            playingVideo: undefined,
            videoInstructorName: "N/A",

            //subscriptions
            isSubscribed: false,
            autoRenovation: false,
            subscriptionTime: 0,
            subscriptionPlan: 0,
        }
        this.addToVideoPlayList = this.addToVideoPlayList.bind(this)
        this.removeFromVideoPlayList = this.removeFromVideoPlayList.bind(this)
        this.playVideoPlayList = this.playVideoPlayList.bind(this)
        this.setVideoAsCompleted = this.setVideoAsCompleted.bind(this)
        this.startSubscription = this.startSubscription.bind(this)
        this.endSubscription = this.endSubscription.bind(this)
        this.setAutoRenovation = this.setAutoRenovation.bind(this)
        this.setNewSubscriptionPlan = this.setNewSubscriptionPlan.bind(this)
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
        let subscription = await requestSubscriptionTime(USER_ID)
        let subscriptionTime = subscription[0] !== 404 ? subscription[1].time : 0
        if (subscriptionTime > 0) {
            this.setState({
                isSubscribed: true,
                subscriptionTime
            })
        }
        this.setState({
            user,
            lessons,
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
        this.removeFromVideoPlayList(id)
        if (!this.state.isSubscribed) {
            if (!this.state.autoRenovation) {
                this.setCurrentWindow('subscription')
                this.stopVideoPlayList()
                return
            } else if (this.state.videoPlayList.length > 0) {
                this.startSubscription(this.state.subscriptionPlan)
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
        this.setCurrentWindow('player')
    }

    async startSubscription(subscriptionPlan) {
        let subscription = await requestCreateSubscription(USER_ID, subscriptionPlan)
        this.setState({
            isSubscribed: true,
            subscriptionTime: subscription[1].time,
            subscriptionPlan,
        })

        if (this.state.currentWindow === 'subscription') {
            this.setCurrentWindow('home')
        }
    }

    endSubscription() {
        this.setState({
            isSubscribed: false
        })
    }

    setAutoRenovation(autoRenovation) {
        this.setState({
            autoRenovation
        })
    }

    setNewSubscriptionPlan(subscriptionPlan) {
        this.setState({
            subscriptionPlan
        })
    }

    setCurrentWindow = currentWindow => {
        if (currentWindow !== 'player') {
            this.removeAllFromVideoPlayList()
        } else {
            if (!this.state.isSubscribed) {
                if (!this.state.autoRenovation) {
                    currentWindow = 'subscription'
                } else {
                    this.startSubscription(this.state.subscriptionPlan)
                }
            }
        }
        this.setState({
            lastWindow: this.state.currentWindow,
            currentWindow
        })
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
                case 'subscription':
                    return (<Subscription
                        isSubscribed={this.state.isSubscribed}
                        subscriptionPlan={this.state.subscriptionPlan}
                        autoRenovation={this.state.autoRenovation}
                        setAutoRenovation={this.setAutoRenovation}
                        startSubscription={this.startSubscription}
                        setNewPlan={this.setNewSubscriptionPlan} />)
            }
        }
    }

    renderSubscription() {
        if (!this.state.loading) {
            if (!this.state.isSubscribed) {
                if (this.state.currentWindow !== "subscription") {
                    let text = !this.state.autoRenovation ? "SUSCRÍBETE" : "RENOVACIÓN PENDIENTE"
                    return (
                        <button
                            className="top-bar-subscription-button"
                            onClick={() => this.setCurrentWindow('subscription')}>{text}</button>
                    )
                }
            } else {
                return (
                    <SubscriptionTimer
                        endSubscription={this.endSubscription}
                        startTime={this.state.subscriptionTime}
                        onChangeWindow={this.setCurrentWindow} />
                )
            }
        }
    }

    render() {
        return (
            <div className="app">
                <div className="top-bar">
                    <img className="top-bar-logo"
                        src={logoTop}
                        onClick={() => this.setCurrentWindow('home')}></img>
                    {this.renderSubscription()}
                </div>
                <main className="container">
                    {this.renderCurrentWindow()}
                </main>
            </div>
        );
    }
}
export default App;
