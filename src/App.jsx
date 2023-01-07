import { useEffect, useRef, useState } from 'react';
import { isEmpty, cloneDeep } from 'lodash';

import { initiateMSTR } from './utils/mstr.utils';

import './styles/App.css';

const App = () => {
  const [dossier, setDossier] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState({});
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

      setSelectedFilterCategory(defaultNestedFilters);
      setFilterOptions(dossierFilters);
      setLoading(false);
    }
  };

  const handleOnFilterUpdateEvent = (e) => {
    setFilterOptions(e.filterInfo);
  };

  const handleInitiateMstrDossier = async () => {
    if (mstrContainer) {
      const mstrDossier = await initiateMSTR(mstrContainer);
      setDossier(mstrDossier);

      // Update filters when page switches
      mstrDossier.registerEventHandler(
        window.microstrategy.dossier.EventType.ON_PAGE_SWITCHED,
        updateFilters
      );

      // Update filters when page finishes loading
      mstrDossier.registerEventHandler(
        window.microstrategy.dossier.EventType.ON_PAGE_LOADED,
        updateFilters
      );

      mstrDossier.registerEventHandler(
        window.microstrategy.dossier.EventType.ON_FILTER_UPDATED,
        handleOnFilterUpdateEvent
      );
    }
  };

  const handleOnFilterChange = (value) => {
    if (value) {
      const filter = filterOptions.find((i) => i.filterName === value);
      setSelectedFilterCategory(filter);
    }
  };

  const handleNestedOptionClick = (e) => {
    let nestedOptions;

    if (selectedFilterCategory.filterDetail.supportMultiple) {
      nestedOptions = selectedFilterCategory.filterDetail.items.map((option) => {
        if (option.value === e.target.value) {
          return { ...option, selected: !option.selected };
        }
        return option;
      });
    } else {
      nestedOptions = selectedFilterCategory.filterDetail.items.map((option) => {
        if (option.value === e.target.value) {
          return { ...option, selected: true };
        }
        return { ...option, selected: false };
      });
    }
    if (nestedOptions) {
      const tempSelectedFilter = cloneDeep(selectedFilterCategory);

      Object.assign(tempSelectedFilter, {
        filterDetail: {
          supportMultiple: selectedFilterCategory.filterDetail.supportMultiple,
          items: nestedOptions
        }
      });

      setSelectedFilterCategory(tempSelectedFilter);
    }
  };

  const handleAllSelections = (selected) => {
    const nestedOptions = selectedFilterCategory.filterDetail.items.map((item) => ({
      ...item,
      selected
    }));

    const tempSelectedFilter = cloneDeep(selectedFilterCategory);

    Object.assign(tempSelectedFilter, {
      filterDetail: {
        supportMultiple: selectedFilterCategory.filterDetail.supportMultiple,
        items: nestedOptions
      }
    });

    setSelectedFilterCategory(tempSelectedFilter);
  };

  const handleAllSelectionsAndSubmit = (selected) => {
    handleAllSelections(selected);
    if (selected) {
      dossier.filterSelectAllAttributes({
        filterInfo: {
          key: selectedFilterCategory.filterKey
        },
        holdSubmit: false
      });
    } else {
      dossier.filterDeselectAllAttributes({
        filterInfo: {
          key: selectedFilterCategory.filterKey
        },
        holdSubmit: false
      });
    }
  };
  const applyFilter = () => {
    const filterInfo = {
      key: selectedFilterCategory.filterKey
    };

    if (selectedFilterCategory.filterDetail.supportMultiple) {
      const selections = [];

      // For each selected value add it to the array
      selectedFilterCategory.filterDetail.items.forEach((item) => {
        if (item.selected) {
          selections.push({ value: item.value });
        }
      });

      const filterJson = {
        filterInfo,
        selections
      };
      dossier.filterSelectMultiAttributes(filterJson);
    } else {
      let selection = null;

      selectedFilterCategory.filterDetail.items.forEach((item) => {
        if (item.selected) {
          selection = { value: item.value };
        }
      });

      // Check if there was a selection made, apply it if there is. Clear the filter otherwise.
      if (selection) {
        const filterJson = {
          filterInfo,
          selection
        };

        dossier.filterSelectSingleAttribute(filterJson);
      } else {
        const filterJson = {
          filterInfo
        };

        dossier.filterClear(filterJson);
      }
    }
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
            This code sample covers how to retrieve and apply the &quot;attributeSelector&quot;
            filter
          </span>
          <span className="instruction">
            1) Select the &quot;attributeSelector&quot; filter you want to modify
          </span>
          <span className="instruction">
            2) Change the values you want to modify in each filter
          </span>
          <span className="instruction">
            For more information on using filters, visit &nbsp;
            <a
              href="https://microstrategy.github.io/embedding-sdk-docs/add-functionality/filters"
              target="_blank"
              rel="noreferrer">
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
          <label htmlFor="filterList">Current List of &quot;attributeSelector&quot; Filters:</label>
          <select
            id="filterList"
            value={selectedFilterCategory.filterName}
            onChange={(e) => handleOnFilterChange(e.target.value)}>
            {filterOptions?.length !== 0 &&
              filterOptions?.map((option) => (
                <option key={option.filterKey} value={option.filterName}>
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
                disabled={!selectedFilterCategory?.filterDetail?.supportMultiple}
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
              {isEmpty(selectedFilterCategory) &&
              isEmpty(selectedFilterCategory?.filterDetail?.items) ? (
                <span>No values found</span>
              ) : (
                selectedFilterCategory?.filterDetail?.items?.map((item) => (
                  <label key={item.value}>
                    <input
                      type={
                        selectedFilterCategory?.filterDetail?.supportMultiple ? 'checkbox' : 'radio'
                      }
                      className="attributeSelectorValues"
                      name="attributeSelectorValues"
                      value={item.value}
                      checked={item.selected}
                      onChange={handleNestedOptionClick}
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
                disabled={!selectedFilterCategory?.filterDetail?.supportMultiple}
                onClick={() => handleAllSelectionsAndSubmit(true)}
              />
              <input
                type="button"
                className="basic-button"
                id="attributeSelectorValuesDeselectAllAndSubmit"
                value="Deselect All and Submit"
                onClick={() => handleAllSelectionsAndSubmit(false)}
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
