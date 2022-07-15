import React, {useState } from "react";
import './style.scss'

export default function CustomPagination(props) {
  const {totalPage, handlePageChange, currentPage} = props
  return (
    <div className="custom-pagination">
      <div class="pagination">
        <a href style={{cursor: 'pointer'}} onClick={() => {
          if ( currentPage > 0 ) {
            handlePageChange(currentPage - 1)
            window.scrollTo(0, 0)
          }
        }}>&laquo;</a>
        <a href>{(currentPage + 1) + ' / ' + totalPage}</a>
        <a href style={{cursor: 'pointer'}} onClick={() => {
          if ( currentPage < totalPage ) {
            handlePageChange(currentPage + 1)
            window.scrollTo(0, 300)
          }
        }}>&raquo;</a>
      </div>
    </div>
  );
}
