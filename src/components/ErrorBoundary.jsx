import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Optionally log error
  }
  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red", padding: 32 }}>Something went wrong in the dashboard. Please reload or check your data file.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
