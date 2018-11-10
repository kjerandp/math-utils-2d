export default class Cache {
  constructor(getValidityToken = () => true) {
    this.cache = new Map();

    // a function that should return a value, which can be used to
    // compare with locally stored validateToken in order to
    // determine if cache is still valid or not
    this.getValidityToken = getValidityToken;
  }

  validate() {
    const validateToken = this.getValidityToken();
    if (!this.validateToken || this.validateToken === validateToken) {
      return true;
    }
    this.validateToken = validateToken;
    return false;
  }

  updateValidityToken() {
    const validateToken = this.getValidityToken();
    if (this.validateToken && this.validateToken !== validateToken) {
      this.cache.clear();
    }
    this.validateToken = validateToken;
  }

  get(key) {
    if (!this.validate()) return undefined;
    return this.cache.get(key);
  }

  set(key, val) {
    this.updateValidityToken();
    this.cache.set(key, val);
  }
}
