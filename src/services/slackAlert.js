export default async function sendSlackAlert({ webhookUrl, name, changes, urlId, originalUrl }) {
  if (!webhookUrl || !urlId || !originalUrl) return;

  const changed = changes.some(change => change.beforeHtml !== change.afterHtml);

  let text = changed
    ? `🔔 *${name}* 페이지에서 모니터링 중인 요소가 *변경되었습니다.*\n`
    : `📌 *${name}* 페이지의 모니터링 요소에 *변경 사항이 없습니다.*\n`;

  if (changed) {
    text += `\n*변경된 내용 요약:*\n`;

    const changedList = changes
      .filter(change => change.beforeHtml !== change.afterHtml)
      .slice(0, 3)
      .map((change, i) => formatChange(change, i, originalUrl))
      .join("\n");

    text += changedList;

    const totalChanges = changes.filter(c => c.beforeHtml !== c.afterHtml).length;

    if (totalChanges > 3) {
      text += `\n\n_외 ${totalChanges - 3}개 항목이 더 있습니다._`;
    }
  }

  text += `\n\n🔗 *<https://jan-bi.netlify.app/history/${urlId} | 변경 상세 페이지로 이동>*`;

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

  function formatChange(change, index, originalUrl) {
    const isImage = change.tag === "IMG";

    if (isImage) {
      return `\n${index + 1}. *이미지 변경됨*\n> 이미지가 변경되었습니다. [페이지에서 확인하기](${originalUrl})`;
    }

    const before = formatForSlack(change.beforeHtml || "없음");
    const after = formatForSlack(change.afterHtml || "없음");

    return `\n${index + 1}. *요소 변경 내역:*\n> before: \`${before}\`\n> after: \`${after}\``;
  }

  function formatForSlack(text) {
    return text
      .replace(/\n/g, " ")
      .replace(/`/g, "'")
      .replace(/</g, "")
      .replace(/>/g, "")
      .slice(0, 100);
  }
}
