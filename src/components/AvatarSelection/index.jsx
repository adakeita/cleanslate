import PropTypes from 'prop-types';

const AvatarSelection = ({ selectedAvatar, onAvatarSelect, avatars }) => {
  return (
    <div className="avatar-select-wrapper">
      {avatars.map((avatar) => (
        <div
          key={avatar.id}
          className={`avatar-img-container ${selectedAvatar === avatar.url ? "selected" : ""}`}
          onClick={() => onAvatarSelect(avatar.url)}
        >
          <img src={avatar.url} alt={avatar.label} />
        </div>
      ))}
    </div>
  );
};

AvatarSelection.propTypes = {
  selectedAvatar: PropTypes.string.isRequired,
  onAvatarSelect: PropTypes.func.isRequired,
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default AvatarSelection;
