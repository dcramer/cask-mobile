import PropTypes from 'prop-types';

export const User = PropTypes.shape({
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
});

export const Bottle = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  distillery: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  abv: PropTypes.number,
  statedAge: PropTypes.number,
  vintageYear: PropTypes.number,
  bottleYear: PropTypes.number,
  caskType: PropTypes.string,
  series: PropTypes.string,
});

export const CheckIn = PropTypes.shape({
  id: PropTypes.string,
  bottle: Bottle.isRequired,
  location: PropTypes.string,
  notes: PropTypes.string,
  flavorProfile: PropTypes.arrayOf(PropTypes.string),
  friends: PropTypes.arrayOf(User),
});

export default {
  Bottle,
  CheckIn,
  User,
};
