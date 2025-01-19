import { state } from '../model.js';
import View from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `no Recipe found for your query! 
   please try again (; `;
  _message = ``;
  _generateMarkup() {
    return `${this._data
      .map(results => previewView.render(results, false))
      .join()}`;
  }
}

export default new ResultsView();
