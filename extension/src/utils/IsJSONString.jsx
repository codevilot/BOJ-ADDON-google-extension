export const IsJSONString = (string) => {
  try {
    const json = JSON.parse(string);
    return json;
  } catch (e) {
    return false;
  }
};
