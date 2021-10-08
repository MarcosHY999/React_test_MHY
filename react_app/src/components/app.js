import React from 'react';
import '../assets/css/app.css';
import logoTop from '../assets/images/logo_bc.png'
import Home from './home'
import Subscription from './subscription';
import SubscriptionTimer from './subscriptionTimer';
import {
    requestUserProfile, requestLessons,
    requestCreateSubscription, requestSubscriptionInfo
} from '../requests.js'
import PlayListManager from './playListManager';

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
        }
        this.playListManagerRef = React.createRef()

        this.startSubscription = this.startSubscription.bind(this)
        this.endSubscription = this.endSubscription.bind(this)
        this.setAutoRenovation = this.setAutoRenovation.bind(this)
        this.setSubscriptionPlan = this.setSubscriptionPlan.bind(this)
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
            let subscriptionPlan = subscription[1].subscription
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

    getLastLessons() {
        let lessons = this.state.lessons;
        return lessons.slice(lessons.length - 9).reverse()
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

    endSubscription() {
        this.setState({
            isSubscribed: false,
            wasSubscribed: this.state.autoRenovation
        })
    }

    setAutoRenovation(autoRenovation) {
        this.setState({
            autoRenovation
        })
    }

    setSubscriptionPlan(subscriptionPlan) {
        this.setState({
            subscriptionPlan
        })
    }

    setCurrentWindow = currentWindow => {
        if (currentWindow === "home") {
            this.playListManagerRef.current.removeAllFromVideoPlayList()
        } else {
            if (!this.state.isSubscribed) {
                if (currentWindow !== "lessonList") {
                    if (!this.state.autoRenovation) {
                        currentWindow = 'subscription'
                    } else {
                        this.startSubscription(this.state.subscriptionPlan)
                    }
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
                default:
                    return (<Home
                        onChangeWindow={this.setCurrentWindow}
                        onPlayVideo={this.playListManagerRef.current.setPlayingVideo}
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

                case 'lessonList':
                case 'player':
                    break

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
                    <PlayListManager
                        isSubscribed={this.state.isSubscribed}
                        autoRenovation={this.state.autoRenovation}
                        subscriptionPlan={this.state.subscriptionPlan}
                        startSubscription={this.startSubscription}
                        ref={this.playListManagerRef}
                        lessons={this.state.lessons}
                        lastWindow={this.state.lastWindow}
                        currentWindow={this.state.currentWindow}
                        onChangeWindow={this.setCurrentWindow} />
                    {this.renderCurrentWindow()}
                </main>
            </div>
        );
    }
}
export default App;
