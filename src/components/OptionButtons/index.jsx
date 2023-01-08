import PropTypes from 'prop-types';

const OptionButtons = ({ name, value, type, checked, onChange }) => (
  <label>
    <input
      type={type}
      className="attributeSelectorValues"
      name="attributeSelectorValues"
      value={value}
      checked={checked}
      onChange={onChange}
    />
    {name}
  </label>
);

export default OptionButtons;

OptionButtons.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
