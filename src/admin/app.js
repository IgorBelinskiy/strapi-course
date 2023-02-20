const myPrimaryColor = '#fd0000';

const config = {
  locales: [
    'de',
    'it',
  ],
  auth: {
    logo: undefined,
  },
  menu: {
    logo: undefined
  },
  head: {
    favicon: undefined,
  },
  theme: {
    colors: {
      buttonPrimary500: myPrimaryColor,
      primary600: myPrimaryColor,
    }
  }
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
