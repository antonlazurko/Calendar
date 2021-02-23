//Local Storage get
export const getParsedLocalStorageData = key => {
  try {
    return JSON.parse(localStorage.getItem(key)) || undefined;
  } catch (err) {
    alert(`ERROR: ${err}`);
  }
};
//Local Storage set
export const setLocalStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    alert(`ERROR: ${err}`);
  }
};
