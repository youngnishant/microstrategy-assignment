import { useState } from 'react';

import FiltersForm from '../containers/FiltersForm';
import DossierContainer from '../containers/DossierContainer';
import Loader from '../components/Loader';
import Instructions from '../components/Instructions';

import './styles.css';

const AttributeSelectorExample = () => {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Loader loading={loading} />
      <div className="basic-container">
        <Instructions />
        <FiltersForm dossier={dossier} setLoading={setLoading} />
      </div>
      <DossierContainer setDossier={setDossier} />
    </>
  );
};

export default AttributeSelectorExample;
