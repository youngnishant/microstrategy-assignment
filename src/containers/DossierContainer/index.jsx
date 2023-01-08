import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { initiateMSTR } from '../../utils/mstr.utils';

const DossierContainer = ({ setDossier }) => {
  const mstrContainer = useRef(null);

  const handleInitiateMstrDossier = async () => {
    if (mstrContainer) {
      const mstrDossier = await initiateMSTR(mstrContainer);
      setDossier(mstrDossier);
    }
  };

  useEffect(() => {
    handleInitiateMstrDossier();
  }, [mstrContainer]);

  return <div ref={mstrContainer} id="embedding-dossier-container" />;
};

DossierContainer.propTypes = {
  setDossier: PropTypes.func.isRequired
};

export default DossierContainer;
