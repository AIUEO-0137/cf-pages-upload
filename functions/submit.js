const secretKey = crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode("00000000000000000000000000000000"),
  { name: "AES-GCM" },
  false,
  ["encrypt", "decrypt"]
);

// 暗号化する関数
async function encryptData(data) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 初期化ベクトル
  const encodedData = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv
    },
    await secretKey,
    encodedData
  );
  return {
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}

export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const nickname = formData.get('nickname');
  const mobile = formData.get('mobile');
  const mail = formData.get('mail');
  const amount = formData.get('amount');
  const details = formData.get('details');

  if (!nickname || !mobile || !mail || !amount || !details) {
    return new Response('Missing fields', { status: 400 });
  }

  const payload = { nickname, mobile, mail, amount, details };

  const encrypted = await encryptData(payload);

  const KV = context.env.MY_KV;
  const id = crypto.randomUUID();
  await KV.put(id, JSON.stringify(encrypted));

  return new Response('保存成功！');
}
