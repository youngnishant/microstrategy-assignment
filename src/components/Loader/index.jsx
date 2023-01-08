import PropTypes from 'prop-types';

import './styles.css';

const Loader = ({ loading }) => (loading ? <p className="loader">Loading...</p> : null);

export default Loader;

Loader.propTypes = {
  loading: PropTypes.bool.isRequired
};
