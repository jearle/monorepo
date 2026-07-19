export const createUtilsHTTPResponseOutput = async (response: Response) => {
  const body = await response.text();
  const headers = Object.fromEntries(response.headers.entries());
  const output = {
    body,
    headers,
    status: response.status,
    statusText: response.statusText,
  };

  return output;
};
