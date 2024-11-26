export function createResponse({
  success = true,
  data = null,
  message = null,
  status = 200,
}) {
  return new Response(
    JSON.stringify({
      success,
      message,
      data,
    }),
    { status, headers: { "Content-Type": "application/json" } }
  );
}
