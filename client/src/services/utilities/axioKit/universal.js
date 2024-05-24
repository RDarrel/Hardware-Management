import axios from "axios";

/**
 * A universal GET request.
 *
 * @param {string} entity - Base route of the API.
 * @param {string} token - Authorization Token.
 * @param {string|object} key - Headers that will be passed to the api.
 * @returns {{ success: boolean, payload: Array<any>|object }} - The result object containing success and payload.
 */
const universal = async (name, token, key = "") => {
  if (typeof key === "object") {
    key = `?${Object.keys(key)
      .map(i => `${i}=${key[i]}`)
      .join("&")}`;
  }

  return await axios
    .get(`${name}${key}`, {
      headers: {
        Authorization: `QTracy ${token}`,
      },
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      const { error, message } = response.data;
      throw new Error(message ? `${error}: ${message}` : error);
    });
};

export default universal;
