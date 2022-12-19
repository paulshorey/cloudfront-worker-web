export const basicJSONResponse = async (objectOrPromise, pretty) => {
  const data = objectOrPromise instanceof Promise ? await objectOrPromise : objectOrPromise;
  return new Response(JSON.stringify(data, null, pretty ? 2 : 0), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const basicJSONErrorResponse = (error, pretty) => {
  return basicJSONResponse(
    {
      error: typeof error === "string" ? error : error.message,
    },
    pretty
  );
};
