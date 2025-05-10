export async function onRequestGet(context) {
  const kv = context.env.MY_KV;
  const list = await kv.list();

  const logsByDate = {};

  for (const item of list.keys) {
    const value = await kv.get(item.name);
    const log = JSON.parse(value);
    const date = log.timestamp.split("T")[0];

    if (!logsByDate[date]) logsByDate[date] = [];
    logsByDate[date].push(log);
  }

  return new Response(JSON.stringify(logsByDate), {
    headers: { "Content-Type": "application/json" }
  });
}
