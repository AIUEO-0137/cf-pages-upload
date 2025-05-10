export const onRequestPost = async ({ request, env }) => {
  try {
    const data = await request.json();
    const timestamp = new Date().toISOString();

    const record = {
      nickname: data.nickname,
      mobile: data.mobile,
      mail: data.mail,
      amount: data.amount,
      details: data.details,
      timestamp: timestamp
    };

    await env.MY_KV.put(`form-${timestamp}`, JSON.stringify(record));
    return new Response("保存成功！", { status: 200 });

  } catch (err) {
    return new Response("サーバーエラー： " + err.message, { status: 500 });
  }
};
