//Local Storage get
function getParsedLocalStorageData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || undefined;
  } catch (err) {
    alert(`ERROR: ${err}`);
  }
}
//Local Storage set
function setLocalStorageData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    alert(`ERROR: ${err}`);
  }
}
export default { getParsedLocalStorageData, setLocalStorageData };
