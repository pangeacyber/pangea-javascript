function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const handle202Response = async (
  response: Record<string, any>,
  headers: Record<string, any>,
  retry: number = 0
): Promise<Record<string, any>> => {
  if (response?.status === "Accepted" && !!response?.result?.location) {
    return delay(1000 + 500 * retry)
      .then(() =>
        fetch(response?.result?.location, {
          method: "GET",
          headers,
        })
      )
      .then(async (response) =>
        handle202Response(await response.json(), headers, retry + 1)
      );
  }

  return response;
};
