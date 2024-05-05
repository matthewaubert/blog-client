enum Environment {
  DEV,
  PROD,
}

export const ENV = Environment.DEV;

export const BASE_URL = (() => {
  switch (ENV as Environment) {
    case Environment.DEV:
      return 'http://localhost:3000/';
    case Environment.PROD:
      return 'https://blog-api-ma.fly.dev/';
  }
})();
