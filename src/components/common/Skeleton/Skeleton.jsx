import PropTypes from "prop-types";
import "./Skeleton.css";

/**
 * Skeleton - A versatile skeleton loading component
 * Use for perceived performance improvement during content loading
 */
const Skeleton = ({
    variant = "text",
    width,
    height,
    className = "",
    count = 1,
    style = {},
}) => {
    const getVariantClass = () => {
        switch (variant) {
            case "text":
                return "skeleton-text";
            case "text-sm":
                return "skeleton-text-sm";
            case "text-lg":
                return "skeleton-text-lg";
            case "title":
                return "skeleton-title";
            case "avatar":
                return "skeleton-avatar";
            case "card":
                return "skeleton-card";
            case "image":
                return "skeleton-image";
            case "button":
                return "skeleton-button";
            case "custom":
                return "";
            default:
                return "skeleton-text";
        }
    };

    const skeletonStyle = {
        ...style,
        ...(width && { width: typeof width === "number" ? `${width}px` : width }),
        ...(height && { height: typeof height === "number" ? `${height}px` : height }),
    };

    const elements = Array.from({ length: count }, (_, index) => (
        <div
            key={index}
            className={`skeleton skeleton-cyber ${getVariantClass()} ${className}`}
            style={skeletonStyle}
            aria-hidden="true"
        />
    ));

    return count === 1 ? elements[0] : <>{elements}</>;
};

/**
 * SkeletonCard - Pre-built card skeleton with title and text
 */
export const SkeletonCard = ({ lines = 3, showImage = false }) => (
    <div className="skeleton-card">
        {showImage && <Skeleton variant="image" style={{ marginBottom: "1rem" }} />}
        <Skeleton variant="title" width="70%" />
        <Skeleton variant="text" count={lines} />
        <Skeleton variant="text-sm" width="40%" />
    </div>
);

SkeletonCard.propTypes = {
    lines: PropTypes.number,
    showImage: PropTypes.bool,
};

/**
 * SkeletonToolCard - Skeleton for security tool cards
 */
export const SkeletonToolCard = () => (
    <div className="skeleton-card" style={{ textAlign: "center", padding: "2rem" }}>
        <Skeleton variant="avatar" style={{ margin: "0 auto 1rem" }} />
        <Skeleton variant="title" width="60%" style={{ margin: "0 auto 0.5rem" }} />
        <Skeleton variant="text" />
        <Skeleton variant="text-sm" width="80%" style={{ margin: "0 auto" }} />
    </div>
);

/**
 * SkeletonTable - Skeleton for data tables
 */
export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
    <div style={{ width: "100%" }}>
        {/* Header */}
        <div className="skeleton-flex" style={{ marginBottom: "1rem", gap: "1rem" }}>
            {Array.from({ length: columns }, (_, i) => (
                <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={24} />
            ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} className="skeleton-flex" style={{ marginBottom: "0.75rem", gap: "1rem" }}>
                {Array.from({ length: columns }, (_, colIndex) => (
                    <Skeleton key={colIndex} variant="text-sm" width={`${100 / columns}%`} />
                ))}
            </div>
        ))}
    </div>
);

SkeletonTable.propTypes = {
    rows: PropTypes.number,
    columns: PropTypes.number,
};

/**
 * SkeletonPage - Full page skeleton for route loading
 */
export const SkeletonPage = ({ type = "default" }) => {
    if (type === "tool") {
        return (
            <div className="skeleton-container">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Skeleton variant="title" width="300px" style={{ margin: "0 auto 0.5rem" }} />
                    <Skeleton variant="text" width="400px" style={{ margin: "0 auto" }} />
                </div>
                <div className="skeleton-card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Skeleton variant="text" width="40%" style={{ marginBottom: "0.5rem" }} />
                    <Skeleton variant="custom" height={48} style={{ marginBottom: "1rem" }} />
                    <Skeleton variant="button" />
                </div>
            </div>
        );
    }

    if (type === "grid") {
        return (
            <div className="skeleton-container">
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Skeleton variant="title" width="250px" style={{ margin: "0 auto 0.5rem" }} />
                    <Skeleton variant="text" width="350px" style={{ margin: "0 auto" }} />
                </div>
                <div className="skeleton-grid skeleton-grid-3">
                    {Array.from({ length: 6 }, (_, i) => (
                        <SkeletonCard key={i} lines={2} />
                    ))}
                </div>
            </div>
        );
    }

    // Default page skeleton
    return (
        <div className="skeleton-container">
            <div className="skeleton-hero">
                <Skeleton variant="avatar" width={80} height={80} />
                <Skeleton variant="title" width="300px" />
                <Skeleton variant="text-lg" width="400px" />
                <div className="skeleton-flex" style={{ marginTop: "1rem" }}>
                    <Skeleton variant="button" />
                    <Skeleton variant="button" width={150} />
                </div>
            </div>
            <div className="skeleton-stats">
                {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="skeleton-stat-item">
                        <Skeleton variant="title" width={60} height={40} style={{ margin: "0 auto 0.5rem" }} />
                        <Skeleton variant="text-sm" width={80} style={{ margin: "0 auto" }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

SkeletonPage.propTypes = {
    type: PropTypes.oneOf(["default", "tool", "grid"]),
};

Skeleton.propTypes = {
    variant: PropTypes.oneOf([
        "text",
        "text-sm",
        "text-lg",
        "title",
        "avatar",
        "card",
        "image",
        "button",
        "custom",
    ]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    className: PropTypes.string,
    count: PropTypes.number,
    style: PropTypes.object,
};

export default Skeleton;
