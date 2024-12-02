export function createErrorResponse({
  message = "An error occurred",
  status = 500,
  errors = null,
}) {
  return new Response(JSON.stringify({ message, errors, success: false }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
