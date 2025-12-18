import { Component } from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="error-boundary-container" style={styles.container}>
                    <div style={styles.content}>
                        <div style={styles.iconWrapper}>
                            <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#ff3e00"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 style={styles.title}>Something went wrong</h2>
                        <p style={styles.message}>
                            We encountered an unexpected error. Please try again or refresh the page.
                        </p>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details style={styles.details}>
                                <summary style={styles.summary}>Error Details</summary>
                                <pre style={styles.errorText}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div style={styles.buttonGroup}>
                            <button
                                onClick={this.handleRetry}
                                style={styles.retryButton}
                                type="button"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                style={styles.reloadButton}
                                type="button"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
        padding: "2rem",
        backgroundColor: "#0a0a0a",
        color: "#e0e0e0",
    },
    content: {
        textAlign: "center",
        maxWidth: "500px",
    },
    iconWrapper: {
        marginBottom: "1.5rem",
    },
    title: {
        fontSize: "1.5rem",
        fontWeight: "600",
        marginBottom: "0.75rem",
        color: "#ffffff",
        fontFamily: "'Rajdhani', sans-serif",
    },
    message: {
        fontSize: "1rem",
        color: "#a0a0a0",
        marginBottom: "1.5rem",
        lineHeight: "1.6",
    },
    details: {
        textAlign: "left",
        marginBottom: "1.5rem",
        padding: "1rem",
        backgroundColor: "rgba(255, 62, 0, 0.1)",
        borderRadius: "8px",
        border: "1px solid rgba(255, 62, 0, 0.3)",
    },
    summary: {
        cursor: "pointer",
        color: "#ff3e00",
        marginBottom: "0.5rem",
    },
    errorText: {
        fontSize: "0.75rem",
        color: "#ff6b6b",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        margin: 0,
    },
    buttonGroup: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
    },
    retryButton: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "600",
        color: "#0a0a0a",
        backgroundColor: "#00ffaa",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "'Rajdhani', sans-serif",
    },
    reloadButton: {
        padding: "0.75rem 1.5rem",
        fontSize: "1rem",
        fontWeight: "600",
        color: "#00ffaa",
        backgroundColor: "transparent",
        border: "1px solid #00ffaa",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "'Rajdhani', sans-serif",
    },
};

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
};

ErrorBoundary.defaultProps = {
    fallback: null,
};

export default ErrorBoundary;
