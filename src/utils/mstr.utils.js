import '../vendor-scripts/mstr-web-sdk';

const initiateMSTR = async (ref) => {
  let url =
    'https://demo.microstrategy.com/MicroStrategyLibrary/app/B7CA92F04B9FAE8D941C3E9B7E0CD754/58FD451E1541F23210E9698F84A71985/K149--K142'; // https://{env-url}/{libraryName}/app/{projectId}/{dossierId}

  const config = {
    url: url,
    placeholder: ref.current,
    enableResponsive: true,
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
    filters: [
      {
        key: 'W132',
        selections: [
          {
            id: 'h2014;8D679D5111D3E4981000E787EC6DE8A4'
          }
        ]
      },
      {
        key: 'W134',
        selections: [
          {
            id: 'h201401;8D679D4411D3E4981000E787EC6DE8A4'
          },
          {
            id: 'h201402;8D679D4411D3E4981000E787EC6DE8A4'
          }
        ]
      }
    ]
  };

  return await microstrategy.dossier.create(config);
};

export { initiateMSTR };
