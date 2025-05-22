export default async function sendSlackAlert({ webhookUrl, name, changes }) {
  if (!webhookUrl) return;

  const changed = changes.some(change => change.beforeHtml !== change.afterHtml);

  let text = changed
    ? `🔔 *${name}* 페이지에서 모니터링 중인 요소가 *변경되었습니다.*\n`
    : `📌 *${name}* 페이지의 모니터링 요소에 *변경 사항이 없습니다.*\n`;

  if (changed) {
    text += `\n*변경된 내용 요약:*\n`;

    text += changes
      .filter(change => change.beforeHtml !== change.afterHtml)
      .slice(0, 3)
      .map((change, i) => {
        const before = formatForSlack(change.beforeHtml || "(빈 값)");
        const after = formatForSlack(change.afterHtml || "(빈 값)");

        return `\n${i + 1}. *요소 변경 내역:*\n> before: \`${before}\`\n> after: \`${after}\``;
      })
      .join("\n");

    const totalChanges = changes.filter(c => c.beforeHtml !== c.afterHtml).length;
    if (totalChanges > 3) {
      text += `\n\n_외 ${totalChanges - 3}개 항목이 더 있습니다._`;
    }
  }

  text += `\n\n🔗 *<https://jan-bi.netlify.app/history |JANBI 대시보드로 이동>*`;

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

  function formatForSlack(text) {
    return text
      .replace(/\n/g, " ")
      .replace(/`/g, "'")
      .replace(/</g, "")
      .replace(/>/g, "")
      .slice(0, 100);
  }
}
