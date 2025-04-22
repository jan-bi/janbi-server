export default async function sendSlackAlert({ webhookUrl, name, changes }) {
  if (!webhookUrl) return;

  let text = "";

  if (changes && changes.length > 0) {
    text =   `
    ${name} 페이지에서 모니터링 중인 요소가 변경되었습니다.\n\n` +
    changes.map((change) => {
      return `모니터링 요소: ${change.selector}\n 이전 값: ${change.before}\n 변경된 값: ${change.after}`;
    });
  } else {
    text = `${name} 페이지의 모니터링 요소에 변경 사항이 없습니다.`;
  }

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