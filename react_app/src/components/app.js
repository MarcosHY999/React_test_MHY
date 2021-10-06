import React, { Component } from 'react';
import '../assets/css/app.css';
import logoTop from '../assets/images/logo_bc.png'
import Home from './home'
import LessonList from './lessonList'
import Player from './player'
import { requestUserProfile, requestLessons } from '../requests.js'

class App extends React.Component {
  state = {
    currentWindow: 'home',
    user: undefined,
    lessons: [],
    playingVideo: undefined,
    videoInstructorName: "N/A",
    loading: true,
    instructor: [],
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

  renderCurrentWindow() {
    if (!this.state.loading) {
      switch (this.state.currentWindow) {
        case 'home':
          return (<Home
            onChangeWindow={this.setCurrentWindow}
            onPlayVideo={this.setPlayingVideo}
            user={this.state.user}
            lessons={this.getLastLessons()} />)

        case 'lessonList':
          return (<LessonList
            lessons={this.state.lessons}
            onPlayVideo={this.setPlayingVideo} />)

        case 'player':
          return (<Player
            lesson={this.state.playingVideo}
            instructorName={this.state.videoInstructorName}
            onChangeWindow={this.setCurrentWindow} />)
      }
    }
  }

  setCurrentWindow = currentWindow => {
    this.setState({
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
