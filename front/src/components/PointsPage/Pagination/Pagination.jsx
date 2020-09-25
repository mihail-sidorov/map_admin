import React from 'react';

let Pagination = (props) => {
    console.log('Pagination>>>');

    let onChangePage = (e) => {
        props.changePage(Number(e.currentTarget.getAttribute('page')));
    }

    let onNextPage = () => {
        props.changePage(props.currentPage + 1);
    }

    let onPrevPage = () => {
        props.changePage(props.currentPage - 1);
    }

    let pages = [];
    let weightCurrentPage;
    let prev = [];
    let next = [];
    let onScreenCount = 4;
    let limit = 0;

    if (props.currentPage > 1) {
        prev.push(<button className="pagination__prev" key={1} onClick={onPrevPage}>&lt;</button>);
    }
    if (props.currentPage < props.pages) {
        next.push(<button className="pagination__next" key={1} onClick={onNextPage}>&gt;</button>);
    }

    for (let i = 1; i <= props.pages; i++) {
        if (i === props.currentPage) {
            weightCurrentPage = {fontWeight: 'bold'};
        }
        else {
            weightCurrentPage = {fontWeight: 'normal'};
        }

        if ((onScreenCount !== 1) && (props.pages - onScreenCount !== 1)) {
            if (i === props.currentPage || i === props.pages) {
                pages.push(<a href="#" className="pagination__page" style={weightCurrentPage} key={i} page={i} onClick={onChangePage}>{i}</a>);
                if (i === props.currentPage) {
                    limit++;
                    if ((props.pages - i > 1) && (limit === onScreenCount - 1)) {
                        pages.push(<span key={props.pages + 1}>...</span>);
                    }
                }
            }
            else if (limit < onScreenCount - 1) {
                let verge;
                if (props.pages === props.currentPage) {
                    verge = onScreenCount - 1;
                }
                else {
                    verge = onScreenCount - 2;
                }
    
                if (Math.abs(i - props.currentPage) <= verge) {
                    pages.push(<a href="#" className="pagination__page" style={weightCurrentPage} key={i} page={i} onClick={onChangePage}>{i}</a>);
                    limit++;
                    if ((props.pages - i > 1) && (limit === onScreenCount - 1)) {
                        pages.push(<span key={props.pages + 1}>...</span>);
                    }
                }
            }
        }
        else {
            pages.push(<a href="#" className="pagination__page" style={weightCurrentPage} key={i} page={i} onClick={onChangePage}>{i}</a>);
        }
    }

    return (
        (props.pages > 1) && <div className="pagination">
            {prev}
            <span className="pagination__pages">
                {pages}
            </span>
            {next}
        </div>
    );
}

export default Pagination;