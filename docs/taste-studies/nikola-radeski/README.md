# Nikola Radeski Taste Study

分析对象：https://nikolaradeski.com/#about

这个目录收纳 Nikola Radeski 网站拆解相关文件。以后新的参考站也按同样结构放到 `taste-studies/<site-name>/`，避免文件散落在总目录。

## reports

- `nikolaradeski.com.zh.md`：中文解释版。适合直接阅读，包含“这个网站为什么高级”“中文翻译”“对你个人网站的可执行建议”。
- `nikolaradeski.com.md`：英文原始分析报告。包含 Design Map 和 Taste DNA。
- `nikolaradeski.com.json`：结构化数据。后续如果要转成 Cursor/Windsurf/Claude 规则，或者喂给代码生成器，用这个文件。

## screenshots

- `taste-viewport.jpeg`：1440 x 900 首屏截图。主要用于判断第一眼视觉比例、留白、导航位置、人物图大小。
- `taste-fullpage.jpeg`：整页长截图。主要用于检查页面下方 section、作品列表、评价区和页脚的整体节奏。

## raw-data

- `nikola-dom.json`：页面 DOM/CSS 采集结果。包含颜色、字体、间距、圆角、阴影、图片比例、动效等机器读数。
- `nikola-visible-elements.json`：首屏可见元素列表。用于校准哪些 DOM 元素真的出现在视口里。
- `nikola-fixed-elements.json`：固定或 sticky 元素采集。主要用于分析底部黑色胶囊导航。
- `nikola-nav-items.json`：底部导航每个按钮、文字、图标的尺寸和样式。
- `nikola-title-elements.json`：About 标题中 `Creative` 橙色关键词的拆分数据。
- `nikola-about-snapshot.md`：Playwright 可访问性快照，带元素层级和坐标。
- `playwright-page-snapshot.yml`：Playwright 初次加载页面时保存的页面快照。

## Usage

优先读：

1. `reports/nikolaradeski.com.zh.md`
2. `screenshots/taste-viewport.jpeg`
3. `reports/nikolaradeski.com.json`

只有需要复查具体数值或调试采集结果时，再看 `raw-data/`。
