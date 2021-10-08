import React from 'react';
import '../assets/css/subscription.css'
import check from '../assets/images/check.png'

class Subscription extends React.Component {
    state = {
        isSelected: false,
        optionBox: [
            { name: '1 minuto', value: 1 },
            { name: '5 minutos', value: 5 },
            { name: '10 minutos', value: 10 }
        ],
    }

    componentDidMount() {
        if (this.props.autoRenovation) this.toogleSelection()
    }

    toogleSelection() {
        let newValue = !this.state.isSelected
        this.props.setAutoRenovation(newValue)
        this.setState({
            isSelected: newValue
        })
    }

    renderCheckBox() {
        if (!this.state.isSelected)
            return (
                <React.Fragment>
                    <span className="subscription-auto-section-checkbox-unseleceted"
                        onClick={() => this.toogleSelection()} />
                </React.Fragment>
            )
        else {
            return (
                <React.Fragment>
                    <span className="subscription-auto-section-checkbox-selected"
                        style={{ backgroundImage: `url(${check})` }}
                        onClick={() => this.toogleSelection()}
                    />
                </React.Fragment>)
        }
    }

    renderOptionBox() {
        const { startSubscription, subscriptionPlan, setNewPlan } = this.props;

        if (this.props.isSubscribed || (this.props.wasSubscribed && this.props.autoRenovation)) {
            return (
                this.state.optionBox.map(option => {
                    let outlineSize = subscriptionPlan === option.value ? "6px" : "0px"
                    return (
                        <div className="subscription-options-box"
                            style={{ outline: outlineSize + " solid #ff7900" }}
                            key={option.name}
                            onClick={() => setNewPlan(option.value)}>{option.name}</div>
                    )
                }))
        } else {
            return (
                this.state.optionBox.map(option => {
                    return (
                        <div className="subscription-options-box"
                            key={option.name}
                            onClick={() => startSubscription(option.value)}>{option.name}</div>
                    )
                }))
        }
    }

    render() {
        let text = this.props.isSubscribed ||
            (this.props.wasSubscribed && this.props.autoRenovation) ? "GESTIONAR SUSCRIPCIÓN" : "SUSCRÍBETE"

        return <div className="subscription-container">
            <span className="subscription-title">{text}</span>
            <div className="subscription-auto-section">
                {this.renderCheckBox()}
                <span className="subscription-auto-section-text">Autorenovar automáticamente</span>
            </div>
            <div className="subscription-options">
                {this.renderOptionBox()}
            </div>
        </div>;
    }
}

export default Subscription;
