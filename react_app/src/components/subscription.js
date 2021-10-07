import React from 'react';
import '../assets/css/subscription.css'
import check from '../assets/images/check.png'

class Subscription extends React.Component {
    state = {
        isSelected: false,
    }

    componentDidMount() {
        if (this.props.autoRenovation) this.toogleSelection()
    }

    toogleSelection() {
        this.setState({
            isSelected: !this.state.isSelected
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

    render() {
        const { startSubscription } = this.props;
        const { isSelected } = this.state;

        return <div className="subscription-container">
            <span className="subscription-title">SUSCRÍBETE</span>
            <div className="subscription-auto-section">
                {this.renderCheckBox()}
                <span className="subscription-auto-section-text">Autorenovar automáticamente</span>
            </div>
            <div className="subscription-options">
                <div className="subscription-options-box"
                    onClick={() => startSubscription(10, isSelected)}>1 minuto</div>
                <div className="subscription-options-box"
                    onClick={() => startSubscription(300, isSelected)}>5 minutos</div>
                <div className="subscription-options-box"
                    onClick={() => startSubscription(600, isSelected)}>10 minutos</div>
            </div>
        </div>;
    }
}

export default Subscription;
