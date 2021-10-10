import React from 'react'
import '../assets/css/app.css'
import logoTop from '../assets/images/logo_bc.png'
import Home from './home'
import Subscription from './subscription'
import SubscriptionTimer from './subscriptionTimer'
import VideoManager from './videoManager'
import {
    requestUserProfile, requestLessons,
    requestCreateSubscription, requestSubscriptionInfo
} from '../requests.js'

const USER_ID = 1

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            currentWindow: 'home',
            lastWindow: 'home',
            user: undefined,
            lessons: [],
            loading: true,

            //subscription
            isSubscribed: false,
            wasSubscribed: false,
            autoRenovation: false,
            subscriptionTime: 0,
            subscriptionPlan: 0,
        }
        this.videoManagerRef = React.createRef()

        this.startSubscription = this.startSubscription.bind(this)
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
        let subscription = await requestSubscriptionInfo(USER_ID)

        if (subscription[0] !== 404) {
            let subscriptionTime = subscription[1].time
            let subscriptionPlan = subscription[1].plan
            let autoRenovation = subscription[1].autoRenovation
            this.setState({
                subscriptionPlan,
                autoRenovation
            })
            if (subscriptionTime > 0) {
                this.setState({
                    subscriptionTime,
                    isSubscribed: true,
                })
            }
        }

        this.setState({
            user,
            lessons,
        })
    }

    async startSubscription(subscriptionPlan) {
        let subscription = await requestCreateSubscription(USER_ID,
            subscriptionPlan, this.state.autoRenovation)

        this.setState({
            isSubscribed: true,
            subscriptionTime: subscription[1].time,
            subscriptionPlan,
        })

        if (this.state.currentWindow === 'subscription') {
            this.setCurrentWindow(this.state.lastWindow)
        }
    }

    endSubscription = () => {
        this.setState({
            isSubscribed: false,
            wasSubscribed: this.state.autoRenovation
        })
    }

    setAutoRenovation = autoRenovation => {
        this.setState({
            autoRenovation
        })
    }

    setSubscriptionPlan = subscriptionPlan => {
        this.setState({
            subscriptionPlan
        })
    }

    getLastLessons() {
        let lessons = this.state.lessons
        return lessons.slice(lessons.length - 9).reverse()
    }

    setCurrentWindow = currentWindow => {
        if (currentWindow === "home") {
            this.videoManagerRef.current.removeAllFromVideoPlayList()
        }

        if (currentWindow === "player") {
            if (!this.state.isSubscribed) {
                if (this.state.autoRenovation) {
                    this.startSubscription(this.state.subscriptionPlan)
                } else {
                    currentWindow = 'subscription'
                }
            }
        }

        if (this.state.currentWindow !== currentWindow) {
            this.setState({
                lastWindow: this.state.currentWindow,
                currentWindow
            })
        }
    }

    renderCurrentWindow() {
        if (!this.state.loading) {
            switch (this.state.currentWindow) {
                case 'home':
                    return (<Home
                        changeCurrentWindow={this.setCurrentWindow}
                        onPlayVideo={this.videoManagerRef.current.setPlayingVideo}
                        user={this.state.user}
                        lessons={this.getLastLessons()} />)

                case 'subscription':
                    return (<Subscription
                        isSubscribed={this.state.isSubscribed}
                        wasSubscribed={this.state.wasSubscribed}
                        subscriptionPlan={this.state.subscriptionPlan}
                        autoRenovation={this.state.autoRenovation}
                        setAutoRenovation={this.setAutoRenovation}
                        startSubscription={this.startSubscription}
                        setNewPlan={this.setSubscriptionPlan} />)

                default:
                    break

            }
        }
    }

    renderSubscriptionTopSection() {
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
                        changeCurrentWindow={this.setCurrentWindow} />
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
                    {this.renderSubscriptionTopSection()}
                </div>
                <main className="container">
                    <VideoManager
                        isSubscribed={this.state.isSubscribed}
                        autoRenovation={this.state.autoRenovation}
                        subscriptionPlan={this.state.subscriptionPlan}
                        startSubscription={this.startSubscription}
                        ref={this.videoManagerRef}
                        lessons={this.state.lessons}
                        lastWindow={this.state.lastWindow}
                        currentWindow={this.state.currentWindow}
                        changeCurrentWindow={this.setCurrentWindow} />
                    {this.renderCurrentWindow()}
                </main>
            </div>
        )
    }
}
export default App
