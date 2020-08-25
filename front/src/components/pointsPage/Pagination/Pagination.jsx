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
        pages.push(<a href="#" className="pagination__page" style={weightCurrentPage} key={i} page={i} onClick={onChangePage}>{i}</a>);
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