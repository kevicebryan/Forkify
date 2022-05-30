import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const pageBtn = e.target.closest('.btn--inline');
      if (!pageBtn) return;
      const gotoPage = +pageBtn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const totPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // 1st Page, have other page
    if (currPage === 1 && totPages > 1) {
      return `
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }
    // Last Page
    if (currPage === totPages && totPages > 1) {
      return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}g#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>
      `;
    }
    // Other Page
    if (currPage < totPages) {
      return `
      <button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}g#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>
      <button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }
    // 1st page, no other page
    return '';
  }
}

export default new PaginationView();
