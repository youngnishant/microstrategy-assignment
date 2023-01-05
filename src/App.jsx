import { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';

import { initiateMSTR } from './utils/mstr.utils';

import './styles/App.css';

const App = () => {
  const [dossier, setDossier] = useState(null);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('');
  const [filterOptions, setFilterOptions] = useState([]);
  const [nestedFilterOptions, setNestedFilterOptions] = useState({});
  const [loading, setLoading] = useState(false);

  const mstrContainer = useRef(null);

  const defaultSelectedFilterCategory = 'Year';

  const updateFilters = async () => {
    setLoading(true);
    if (dossier) {
      const dossierFilters = await dossier.getFilterList();
      const defaultNestedFilters = dossierFilters.find(
        (i) => i.filterName === defaultSelectedFilterCategory
      );

      setSelectedFilterCategory(defaultSelectedFilterCategory);
      setFilterOptions(dossierFilters);
      setNestedFilterOptions(defaultNestedFilters.filterDetail);
      setLoading(false);
    }
  };

  const handleInitiateMstrDossier = async () => {
    if (mstrContainer) {
      const mstrDossier = await initiateMSTR(mstrContainer);
      setDossier(mstrDossier);
    }
  };

  const handleOnFilterChange = (value) => {
    if (value) {
      const filter = filterOptions.find((i) => i.filterName === value);
      setSelectedFilterCategory(value);
      setNestedFilterOptions(filter.filterDetail);
    }
  };

  const handleNestedOptionClick = (e) => {
    let allNestedOptions;

    if (nestedFilterOptions.supportMultiple) {
      allNestedOptions = nestedFilterOptions.items.map((option) => {
        if (option.value === e.target.value) {
          return { ...option, selected: !option.selected };
        }
        return option;
      });
    } else {
      allNestedOptions = nestedFilterOptions.items.map((option) => {
        if (option.value === e.target.value) {
          return { ...option, selected: true };
        }
        return { ...option, selected: false };
      });
    }
    if (allNestedOptions) {
      setNestedFilterOptions({
        supportMultiple: nestedFilterOptions.supportMultiple,
        items: allNestedOptions
      });
    }
  };

  const handleAllSelections = (selected, submit = false) => {
    const nestedOptions = nestedFilterOptions.items.map((item) => ({ ...item, selected }));
    setNestedFilterOptions({
      supportMultiple: nestedFilterOptions.supportMultiple,
      items: nestedOptions
    });

    if (submit) {
      console.log('submitting');
    }
  };

  const applyFilter = () => {
    console.log('applying filters');
  };

  useEffect(() => {
    handleInitiateMstrDossier();
  }, [mstrContainer]);

  useEffect(() => {
    updateFilters();
  }, [dossier]);

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
            onClick={updateFilters}
            value="Update Filters"
          />
          <label htmlFor="filterList">Current List of "attributeSelector" Filters:</label>
          <select id="filterList" onChange={(e) => handleOnFilterChange(e.target.value)}>
            {filterOptions.length !== 0 &&
              filterOptions.map((option) => (
                <option
                  key={option.filterKey}
                  selected={option.filterName === selectedFilterCategory}>
                  {option.filterName}
                </option>
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
                onClick={() => handleAllSelections(true)}
                disabled={!nestedFilterOptions.supportMultiple}
              />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesClearAll"
                value="Clear All"
                onClick={() => handleAllSelections(false)}
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
                      checked={item.selected}
                      onClick={handleNestedOptionClick}
                    />
                    {item.name}
                  </label>
                ))
              )}
            </div>
            <div className="flex-col-gap-5">
              <input type="button" value="Submit" className="basic-button" onClick={applyFilter} />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesSelectAllAndSubmit"
                value="Select All and Submit"
                disabled={!nestedFilterOptions.supportMultiple}
                onClick={() => handleAllSelections(true, true)}
              />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesDeselectAllAndSubmit"
                value="Deselect All and Submit"
                onClick={() => handleAllSelections(false, true)}
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
