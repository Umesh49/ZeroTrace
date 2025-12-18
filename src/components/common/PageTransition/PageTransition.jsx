import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import "./PageTransition.css";

/**
 * PageTransition - Wrapper component for smooth page transitions
 * Automatically detects route changes and applies enter/exit animations
 */
const PageTransition = ({
    children,
    variant = "fade",
    className = "",
}) => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(true);
    const [displayChildren, setDisplayChildren] = useState(children);

    const getAnimationClass = () => {
        switch (variant) {
            case "fade":
                return "page-transition";
            case "slide-up":
                return "page-slide-up";
            case "slide-left":
                return "page-slide-left";
            case "cyber":
                return "page-cyber-enter";
            default:
                return "page-transition";
        }
    };

    useEffect(() => {
        // Update displayed children when location changes
        setDisplayChildren(children);
        setIsVisible(true);
    }, [location.pathname, children]);

    return (
        <div className={`${getAnimationClass()} ${className}`} key={location.pathname}>
            {displayChildren}
        </div>
    );
};

PageTransition.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["fade", "slide-up", "slide-left", "cyber"]),
    className: PropTypes.string,
};

/**
 * StaggerContainer - Animates children with staggered delay
 * Great for lists and grids
 */
export const StaggerContainer = ({ children, className = "" }) => (
    <div className={`stagger-children ${className}`}>{children}</div>
);

StaggerContainer.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

/**
 * SkipToContent - Accessibility component for keyboard navigation
 * Should be placed at the top of the app
 */
export const SkipToContent = ({ targetId = "main-content" }) => (
    <a href={`#${targetId}`} className="skip-to-content">
        Skip to main content
    </a>
);

SkipToContent.propTypes = {
    targetId: PropTypes.string,
};

export default PageTransition;
