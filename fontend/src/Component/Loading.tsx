import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
const Loading = (props : any) => {
    return (
        <div className="warper-loading">
            <div className="loading">
                <FontAwesomeIcon icon={faSpinner} spin size={props.size || "3x"} />
            </div>
        </div>
    )
}
export default Loading;