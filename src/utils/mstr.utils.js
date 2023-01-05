import '../vendor-scripts/mstr-web-sdk';

const initiateMSTR = async (ref) => {
  let url =
    'https://demo.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/58FD451E1541F23210E9698F84A71985/K149--K142'; // https://{env-url}/{libraryName}/app/{projectId}/{dossierId}

  const config = {
    url: url,
    placeholder: ref.current,
    navigationBar: {
      enabled: true,
      gotoLibrary: true,
      title: true,
      toc: true,
      reset: true,
      reprompt: true,
      share: false,
      comment: true,
      notification: true,
      filter: false,
      options: true,
      search: true,
      bookmark: true
    },
    enableResponsive: true
  };

  return await microstrategy.dossier.create(config);
};

export { initiateMSTR };
