import { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';

import { initiateMSTR } from './utils/mstr.utils';

import './styles/App.css';

const App = () => {
  const [filterOptions, setFilterOptions] = useState([]);
  const [nestedFilterOptions, setNestedFilterOptions] = useState({});
  const [loading, setLoading] = useState(false);

  const mstrContainer = useRef(null);

  const handleInitiateMstrDossier = async () => {
    setLoading(true);
    if (mstrContainer) {
      const mstrDossier = await initiateMSTR(mstrContainer);
      if (mstrDossier) {
        const dossierFilters = await mstrDossier.getFilterList();
        const defaultNestedFilters = dossierFilters.find((i) => i.filterName === 'Year');

        setFilterOptions(dossierFilters);
        setNestedFilterOptions(defaultNestedFilters.filterDetail);
        setLoading(false);
      }
    }
  };

  const handleOnFilterChange = (value) => {
    if (value) {
      const filter = filterOptions.find((i) => i.filterName === value);
      setNestedFilterOptions(filter.filterDetail);
    }
  };

  useEffect(() => {
    handleInitiateMstrDossier();
  }, [mstrContainer]);

  return (
    <>
      {loading && <p className="loader">Loading...</p>}
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
          <select id="filterList" onChange={(e) => handleOnFilterChange(e.target.value)}>
            {filterOptions.length !== 0 &&
              filterOptions.map((option) => (
                <option key={option.filterKey}>{option.filterName}</option>
              ))}
          </select>
          <div id="currentFilterObject">
            <label htmlFor="currentFilterObjectContent">Current Filter Object:</label>
            <span id="currentFilterObjectContent">Check console for current filter object</span>
          </div>
          <div id="attributeSelector" className="filterType basic-form-layout">
            <label htmlFor="attributeSelectorValuesContainer">
              Select the values to filter on: <br />
            </label>
            <div className="flex-col-gap-5">
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
              {isEmpty(nestedFilterOptions) && isEmpty(nestedFilterOptions.items) ? (
                <span>No values found</span>
              ) : (
                nestedFilterOptions.items.map((item) => (
                  <label>
                    <input
                      type={nestedFilterOptions.supportMultiple ? 'checkbox' : 'radio'}
                      className="attributeSelectorValues"
                      name="attributeSelectorValues"
                      value={item.value}
                      defaultChecked={item.selected}
                    />
                    {item.name}
                  </label>
                ))
              )}
            </div>
            <div className="flex-col-gap-5">
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
