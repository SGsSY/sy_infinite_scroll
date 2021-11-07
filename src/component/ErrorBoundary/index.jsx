import React, { Component } from 'react'

export class ErrorBoundary extends Component {

    state = {
        hasError: false,
    }

    componentDidCatch(error, errorInfo) {
        console.log("Some error happened !!!!!!!");
        console.log("Can call error log api here");
        console.log(error);
        console.log(errorInfo);

        this.setState({
            hasError: true,
        })
    }

    render() {
        if (this.state.hasError) {
            return <h1>OOPS! Something went wrong. Please contact web admin if this keep happenning</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
