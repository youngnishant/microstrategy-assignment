import PropTypes from 'prop-types';

import './styles.css';

const Button = ({ value, onClick, extraClasses, disabled }) => (
  <input
    type="button"
    className={`basic-button ${extraClasses}`}
    value={value}
    onClick={onClick}
    disabled={disabled}
  />
);

Button.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  extraClasses: PropTypes.string,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  extraClasses: '',
  disabled: false
};

export default Button;
