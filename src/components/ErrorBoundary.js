import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Something went wrong.</h1>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;