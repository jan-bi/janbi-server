export default async function sendSlackAlert({ webhookUrl, name, changes }) {
  if (!webhookUrl) return;

  const changed = changes.some(change => change.beforeHtml !== change.afterHtml);

  let text = changed
    ? `${name} 페이지에서 모니터링 중인 요소가 변경되었습니다.\n\n`
    : `${name} 페이지의 모니터링 요소에 변경 사항이 없습니다.\n\n`;

  text += changes
    .map(change => {
      return `이전 값: ${change.beforeHtml}\n변경된 값: ${change.afterHtml}`;
    })
    .join("\n\n");

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text }),
    });

    console.log("슬랙 알림 전송이 완료되었습니다.");
  } catch (err) {
    console.error("슬랙 알림 전송에 실패하였습니다.", err);
  }
}