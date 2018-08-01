import PropTypes from 'prop-types';

export const Bottle = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  distillery: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  abv: PropTypes.string,
  statedAge: PropTypes.number,
  vintageYear: PropTypes.number,
  bottleYear: PropTypes.number,
  caskType: PropTypes.string,
});

export default {
  Bottle,
};
