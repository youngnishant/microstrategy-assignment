import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { initiateMSTR } from '../../utils/mstr.utils';

const DossierContainer = ({ setDossier }) => {
  const mstrContainer = useRef(null);

  // Function to intiate MSTR Dossier
  const handleInitiateMstrDossier = async () => {
    const mstrDossier = await initiateMSTR(mstrContainer);
    setDossier(mstrDossier);
  };

  // Triggered MSTR Intialisation function on mounting of this container
  useEffect(() => {
    handleInitiateMstrDossier();
  }, []);

  return <div ref={mstrContainer} id="embedding-dossier-container" />;
};

DossierContainer.propTypes = {
  setDossier: PropTypes.func.isRequired
};

export default DossierContainer;
