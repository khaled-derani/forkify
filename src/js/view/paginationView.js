import { state } from '../model.js';
import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PageinationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      state.search.resaults.length / state.search.resaultsPerPgae
    );

    console.log(numPages);
    //page 1 , and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
            <button data-goto="${
              curPage + 1
            }"  class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>page ${curPage + 1}</span>
            </button>
      `;
    }
    //page 1 , and there are NO other pages

    //last page
    if (curPage === numPages && numPages > 1) {
      return `
            <button data-goto="${
              curPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
           </button>`;
    }
    //other page
    if (curPage < numPages) {
      return `
            <button data-goto="${
              curPage - 1
            }" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${curPage - 1}</span>
            </button>
            <button data-goto="${
              curPage + 1
            }" class="btn--inline pagination__btn--next">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
                <span>page ${curPage + 1}</span>
            </button>
      
      `;
    }

    return ``;
    // ==============================
    // return `
    //
    //       <button class="btn--inline pagination__btn--next">
    //         <span>Page 3</span>
    //         <svg class="search__icon">
    //           <use href="src/img/icons.svg#icon-arrow-right"></use>
    //         </svg>
    //       </button>
    // `;
  }
}
export default new PageinationView();
