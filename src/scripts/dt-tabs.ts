// 記事の中の「タブ切り替えの比較表」（.dt-tabs）を、タブで切り替えられるようにする（2026-11-23）。
// HTML には、表（パネル）が3つ並んで入っている。スクリプトが動かなくても、3つとも読める。
// 動くときだけ、先頭にタブのボタンを出して、選んだ表だけを表示する。
export {};

const roots = document.querySelectorAll<HTMLElement>(".dt-tabs");

for (const root of roots) {
	const panels = Array.from(root.querySelectorAll<HTMLElement>(":scope > [data-tab-title]"));
	if (panels.length < 2) continue;

	const bar = document.createElement("div");
	bar.className = "dt-tabs__tabs";
	bar.setAttribute("role", "tablist");

	const buttons = panels.map((panel, i) => {
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "dt-tabs__tab";
		btn.setAttribute("role", "tab");
		btn.textContent = panel.dataset.tabTitle || `表${i + 1}`;
		btn.addEventListener("click", () => show(i));
		btn.addEventListener("keydown", (e) => {
			if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
			const next = (i + (e.key === "ArrowRight" ? 1 : -1) + panels.length) % panels.length;
			show(next);
			buttons[next].focus();
		});
		panel.setAttribute("role", "tabpanel");
		bar.appendChild(btn);
		return btn;
	});

	const show = (index: number) => {
		panels.forEach((panel, k) => {
			panel.hidden = k !== index;
			buttons[k].setAttribute("aria-selected", String(k === index));
			buttons[k].tabIndex = k === index ? 0 : -1;
		});
	};

	root.insertBefore(bar, panels[0]);
	show(0);
}

// 店舗情報タブの「店舗一覧」を、ボタンで開閉するプルダウンにする。リストの中身は、記事のHTMLに入っている。
for (const box of document.querySelectorAll<HTMLElement>(".dt-tabs .dt-stores")) {
	const label = box.querySelector<HTMLElement>(".dt-stores__label");
	const list = box.querySelector<HTMLElement>("ul");
	if (!label || !list) continue;
	const btn = document.createElement("button");
	btn.type = "button";
	btn.className = "dt-stores__btn";
	btn.textContent = label.textContent || "店舗一覧";
	btn.setAttribute("aria-expanded", "false");
	label.replaceWith(btn);
	list.hidden = true;
	btn.addEventListener("click", () => {
		const open = list.hidden;
		list.hidden = !open;
		btn.setAttribute("aria-expanded", String(open));
	});
}
