/**
 * Scripts for page elements
 *
 * @module modules/page-elements/js
 */

'use strict';

let handlers = {};

/**
 * toggle element by id
 */
handlers['data-toggle'] = {
  elements: [window],
  event: 'load',
  func: () => {
    const elements = document.querySelectorAll('[data-toggle]');
    elements.forEach((element) => {
      const toggleList = document.querySelectorAll(element.dataset.toggle);
      element.addEventListener('click', () => {
        toggleList.forEach((toggled) => {
          toggled.classList.toggle('hidden');
        });
      });
      toggleList.forEach((toggled) => {
        toggled.childNodes.forEach((child) => {
          child.addEventListener('click', (event) => {
            event.stopPropagation();
          });
        });
      });
    });
  }
};

/**
 * Attach event to elements
 *
 * @param {DOMelement} element - to attach event
 * @param {string} event - type
 * @param {function} handler - event handler
 */
function attachEventHandler(element, event, handler) {
  if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  } else if (element.addEventListener) {
    element.addEventListener(event, handler, false);
  } else {
    element.addEventListener(event, handler, false);
  }
}

/**
 * attach event handlers
 */
Object.values(handlers).forEach((handler) => {
  handler.elements.forEach((element) => {
    attachEventHandler(element, handler.event, handler.func);
  });
});
