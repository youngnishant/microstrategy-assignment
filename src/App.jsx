import { useEffect, useState, useRef } from 'react';
import '../mstr-web-sdk';

import './styles/App.css';

const App = () => {
  const mstrContainer = useRef(null);
  const initiateMSTR = () => {
    let url =
      'https://demo.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/58FD451E1541F23210E9698F84A71985/K149--K142'; // https://{env-url}/{libraryName}/app/{projectId}/{dossierId}

    const config = {
      url: url,
      placeholder: mstrContainer.current,
      navigationBar: {
        enabled: true,
        gotoLibrary: true,
        title: true,
        toc: true,
        reset: true,
        reprompt: true,
        share: false,
        comment: true,
        notification: true,
        filter: false,
        options: true,
        search: true,
        bookmark: true
      },
      enableResponsive: true
    };

    microstrategy.dossier.create(config);
  };

  useEffect(() => {
    if (mstrContainer) {
      initiateMSTR();
    }
  }, [mstrContainer]);

  return (
    <>
      <div className="basic-container">
        <div className="instructions-container">
          <span className="instructions-title">Instructions</span>
          <span className="instruction">
            This code sample covers how to retrieve and apply the "attributeSelector" filter
          </span>
          <span className="instruction">
            1) Select the "attributeSelector" filter you want to modify
          </span>
          <span className="instruction">
            2) Change the values you want to modify in each filter
          </span>
          <span className="instruction">
            For more information on using filters, visit &nbsp;
            <a
              href="https://microstrategy.github.io/embedding-sdk-docs/add-functionality/filters"
              target="_blank">
              documentation.
            </a>
          </span>
        </div>
        <div id="filterListContainer" className="example-container">
          <input
            type="button"
            className="basic-button update-button"
            // onClick="updateFilters()"
            value="Update Filters"
          />
          <label htmlFor="filterList">Current List of "attributeSelector" Filters:</label>
          <select
            id="filterList"
            //  onChange="showFilter(this)"
          ></select>
          <div id="currentFilterObject">
            <label htmlFor="currentFilterObjectContent">Current Filter Object:</label>
            <span id="currentFilterObjectContent">Check console for current filter object</span>
          </div>
          <div id="attributeSelector" className="filterType basic-form-layout">
            <label htmlFor="attributeSelectorValuesContainer">
              Select the values to filter on: <br />
            </label>
            <div>
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesSelectAll"
                value="Select All"
                // onClick="selectAllAttributeValues(attributeSelector,true)"
              />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesClearAll"
                value="Clear All"
                // onClick="selectAllAttributeValues(attributeSelector, false)"
              />
            </div>
            <div
              id="attributeSelectorValuesContainer"
              className="basic-checkbox basic-checkbox__item-list">
              <span>No values found</span>
            </div>
            <div>
              <input
                type="button"
                value="Submit"
                className="basic-button"
                // onClick="applyFilter(attributeSelector)"
              />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesSelectAllAndSubmit"
                value="Select All and Submit"
                // onClick="selectAllAndSubmit()"
              />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesDeselectAllAndSubmit"
                value="Deselect All and Submit"
                // onClick="deselectAllAndSubmit()"
              />
            </div>
          </div>
        </div>
      </div>
      <div ref={mstrContainer} id="embedding-dossier-container" />
    </>
  );
};

export default App;
