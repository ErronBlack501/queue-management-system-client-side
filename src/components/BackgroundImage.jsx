import React from "react"

const BackgroundImage = ({ imageUrl, children, className = "", overlay = false }) => {
    return (
        <div
            className={`relative bg-cover bg-center ${overlay ? "bg-opacity-50" : ""} ${className}`}
            style={{ backgroundImage: `url(${imageUrl})` }}
        >
            {overlay && (
                <div className="absolute inset-0 bg-black bg-opacity-40 z-0"></div>
            )}
            <div className="relative z-10">{children}</div>
        </div>
    )
}

export default BackgroundImage
