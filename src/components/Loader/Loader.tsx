
import React from 'react';

import './loader.css';

class Loader extends React.Component {
    render() {
        return (
            <div className="loader">
                <div className="loadingio-spinner-dual-ball">
                    <div className="ldio">
                        <div>
                        </div>
                        <div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Loader;