import React, { Component } from 'react';
import {
    requestUserProfile,
    requestCreateSubscription, requestSubscriptionInfo
} from '../requests.js';

class SubscriptionManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSubscribed: false,
            wasSubscribed: false,
            autoRenovation: false,
            subscriptionTime: 0,
            subscriptionPlan: 0,
        }
    }

    async componentDidMount() {
        await this.initializeData()
        this.setState({
            loading: false
        })
    }




    render() {
        return <div></div>;
    }
}

export default SubscriptionManager;