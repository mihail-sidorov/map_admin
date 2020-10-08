import React from 'react';
import { CSSTransition } from 'react-transition-group';

let modalWindowHOC = (Component, props, inProp, closeHandler, unmountOnExit, title) => {
    console.log('modalWindowHOC');

    return (
        <CSSTransition in={inProp} timeout={300} unmountOnExit={unmountOnExit}>
            <div className="modal-window">
                <div className="modal-window__cover"></div>
                <div className="modal-window__wrapper" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        closeHandler(null);
                    }
                }}>
                    <div className="modal-window__content-wrapper">
                        <div className="modal-window__content">
                            <div className="modal-window__close" onClick={() => {
                                closeHandler(null);
                            }}></div>
                            <div className="modal-window__head">{title}</div>
                            <div className="modal-window__body">
                                <Component  {...props} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CSSTransition>
    );
}

export default modalWindowHOC;