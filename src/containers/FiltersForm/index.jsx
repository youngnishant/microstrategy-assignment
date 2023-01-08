import { useState, useEffect } from 'react';
import { isEmpty, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';

import Button from '../../components/Button';
import OptionButton from '../../components/OptionButtons';

import './styles.css';

const FiltersForm = ({ dossier, setLoading }) => {
  const [selectedFilterCategory, setSelectedFilterCategory] = useState({});
  const [filterOptions, setFilterOptions] = useState([]);

  const defaultSelectedFilterCategory = 'Year';

  // Function to update filters and reset at default
  const updateFilters = async () => {
    setLoading(true);
    const dossierFilters = await dossier.getFilterList();
    const defaultNestedFilters = dossierFilters.find(
      (i) => i.filterName === defaultSelectedFilterCategory
    );

    setSelectedFilterCategory(defaultNestedFilters);
    setFilterOptions(dossierFilters);
    setLoading(false);
  };

  // Function used to update filter state on filter update event
  const handleOnFilterUpdateEvent = (e) => {
    setFilterOptions(e.filterInfo);
  };

  // Function to handle first filter value change, eg: year or month
  const handleOnFilterChange = (value) => {
    if (value) {
      const filter = filterOptions.find((i) => i.filterName === value);
      setSelectedFilterCategory(filter);
    }
  };

  // Function to handle On change of second filter value eg: 2014 or July 2014
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

  // Function to handle Select or deselect all filter option button, eg select if selected=true
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

  // Function to handle Select or deselect all filter option and submit it
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

  // Function to apply selected filters
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

  // Function to Add MSTR Dossier Event listeners
  const addDossierEventListeners = () => {
    // Update filters when page switches
    dossier.registerEventHandler(
      window.microstrategy.dossier.EventType.ON_PAGE_SWITCHED,
      updateFilters
    );

    // Update filters when page finishes loading
    dossier.registerEventHandler(
      window.microstrategy.dossier.EventType.ON_PAGE_LOADED,
      updateFilters
    );

    // Update filters state when filters are submitted
    dossier.registerEventHandler(
      window.microstrategy.dossier.EventType.ON_FILTER_UPDATED,
      handleOnFilterUpdateEvent
    );
  };

  // Triggered when Dossier value is changed and on mounting of this container
  useEffect(() => {
    if (dossier) {
      addDossierEventListeners();
      updateFilters();
    }
  }, [dossier]);

  return (
    <div id="filterListContainer" className="example-container">
      <Button value="Update Filters" onClick={updateFilters} extraClasses="update-button" />
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
          <Button
            value="Select All"
            onClick={() => handleAllSelections(true)}
            disabled={!selectedFilterCategory?.filterDetail?.supportMultiple}
          />
          <Button value="Clear All" onClick={() => handleAllSelections(false)} />
        </div>
        <div
          id="attributeSelectorValuesContainer"
          className="basic-checkbox basic-checkbox__item-list">
          {isEmpty(selectedFilterCategory) &&
          isEmpty(selectedFilterCategory?.filterDetail?.items) ? (
            <span>No values found</span>
          ) : (
            selectedFilterCategory?.filterDetail?.items?.map((item) => (
              <OptionButton
                key={item.value}
                name={item.name}
                value={item.value}
                checked={item.selected}
                type={selectedFilterCategory?.filterDetail?.supportMultiple ? 'checkbox' : 'radio'}
                onChange={handleNestedOptionClick}
              />
            ))
          )}
        </div>
        <div className="flex-col-gap-5">
          <Button value="Submit" onClick={applyFilter} />
          <Button
            value="Select All and Submit"
            onClick={() => handleAllSelectionsAndSubmit(true)}
            disabled={!selectedFilterCategory?.filterDetail?.supportMultiple}
          />
          <Button
            value="Deselect All and Submit"
            onClick={() => handleAllSelectionsAndSubmit(false)}
          />
        </div>
      </div>
    </div>
  );
};

FiltersForm.propTypes = {
  dossier: PropTypes.any.isRequired,
  setLoading: PropTypes.func.isRequired
};
export default FiltersForm;
