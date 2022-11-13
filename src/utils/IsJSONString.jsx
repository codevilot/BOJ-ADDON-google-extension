export const IsJSONString = (string) => {
  try {
    var json = JSON.parse(string);
    return json;
  } catch (e) {
    return false;
  }
};
