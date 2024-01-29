export default function error(message: string, status = 400) {
  console.error(message)
  return Response.json({ status: message }, { status: status })
}
