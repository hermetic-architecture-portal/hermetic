import loadingStore from './stores/loadingStore';

class UnauthError extends Error {
  constructor() {
    super('Unauthorised');
    this.unauthorised = true;
  }
}

export default async (url, options) => {
  loadingStore.add(url);
  try {
    let response;
    try {
      response = await fetch(url, options);
    } catch (error) {
      console.error(`Error fetching ${url}`, error);
      throw error;
    }
    if (!response.ok) {
      const body = await response.text();
      if (response.status === 401) {
        throw new UnauthError();
      }
      const error = `${response.status} - ${response.statusText}: ${body}`;
      console.error(`Error fetching ${url}`, error);
      throw new Error(error);
    }
    return response.json();
  } catch (error) {
    if (error.unauthorised) {
      // eslint-disable-next-line
      alert('You do not have access to use this application.\nPlease contact the access administrators.');
      throw error;
    }
    // eslint-disable-next-line no-alert
    alert(`Error fetching ${url}: ${error.message}`);
    throw error;
  } finally {
    loadingStore.remove(url);
  }
};
