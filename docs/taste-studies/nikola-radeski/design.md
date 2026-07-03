# 设计原则 Design Principles

> 来源：[Nikola Radeski 网站拆解](reports/nikolaradeski.com.zh.md)（https://nikolaradeski.com/#about）
> 参照标准：Apple Human Interface Guidelines（HIG）、Microsoft Fluent Design System、Material Design 3
>
> 本文把 Nikola Radeski 站点的观察结论提炼为可复用的设计原则，并按苹果、微软等主流设计系统的规范做对齐、命名和取舍。每条原则都给出「观察 → 通用规范 → 落地建议」三段结构。

---

## 0. 核心设计哲学

一句话：**少量强信号 + 大面积安静背景。** 高级感来自克制，而不是元素堆叠。

这与三大设计系统的顶层原则一致：

| 设计系统 | 顶层原则 | 与本站的呼应 |
| --- | --- | --- |
| Apple HIG | Clarity（清晰）、Deference（内容优先）、Depth（层次） | 背景让位于内容，强调色只做「指令标记」 |
| Microsoft Fluent | Light、Depth、Motion、Material、Scale | 浅灰材质表面 + 克制动效 + 层次阴影 |
| Material 3 | 内容优先、可预期的强调、系统化 token | 中性色主导，强调色稀缺化使用 |

四条可执行的约束（后文逐条展开）：

1. 背景用低对比浅灰，不是纯白或大面积渐变。
2. 主内容不铺满屏幕，控制成约 500px 的单列文本宽度。
3. 强调色只用于一个关键词、一个主按钮、极少量状态。
4. 导航做小而固定的控件，不占据顶部大面积。

---

## 1. 间距与栅格 Spacing & Grid

### 观察
- 站点实测间距序列：`5 / 10 / 13 / 15 / 20 / 24 / 29 / 30 / 40 / 42 / 45 / 52` px，基础单位约为 `5px`。
- 页面左右内边距 `30px`，底部 `88px`；未检测到 CSS Grid，靠固定列宽 + 大面积水平留白构图。
- 正文列宽 `532px`，文本列与人物照片之间约 `232px` 留白。

### 通用规范
- **Apple HIG**：以点（pt）为单位，布局与命中区域推荐 8pt 网格，最小可点击目标 `44×44pt`。
- **Microsoft Fluent**：间距基础单位为 `4px`，token 化为 4 的倍数（4/8/12/16/20/24/32…）。
- **Material 3**：8dp 基线网格，图标等小元素允许 4dp。

### 落地建议（规范化后的间距 token）
把站点的「约 5px 基数」规整到 **4px 基线 + 8px 主网格**，既贴近微软/Material，又能覆盖苹果的 8pt：

```
--space-1:  4px    /* 图标微调、描边内缩 */
--space-2:  8px    /* 紧凑间距、圆角 */
--space-3:  12px   /* 按钮纵向内边距 */
--space-4:  16px   /* 段落间距、正文行内 */
--space-5:  24px   /* 卡片圆角、组件内边距 */
--space-6:  32px   /* 页面左右内边距 */
--space-8:  48px   /* 区块间距 */
--space-12: 88px   /* 大区块 / 页脚上方留白 */
```

- 正文列宽保持 **500–560px**（对应最佳阅读行长 45–75 字符，与 HIG 可读性建议一致）。
- 可点击控件高度 ≥ **40px**，触摸目标建议补足到 **44px**（Apple 最小命中区域）。

---

## 2. 字体层级 Typography

### 观察
- 字号阶梯：`230 / 86 / 45 / 36 / 24 / 20 / 16 / 15 / 13` px，几乎统一 `400` 字重。
- 大标题用负字距（`-2px` ~ `-2.5px`）收紧，正文用 `-0.5px`。
- 字体族：General Sans、Clash Display（展示体）、Gloria Hallelujah（手写点缀）。

### 通用规范
- **Apple**：系统字体 SF Pro，内建 Dynamic Type 语义层级（LargeTitle→Title1/2/3→Body→Caption），大字号自动收紧字距。
- **Microsoft Fluent**：字体 Segoe UI Variable，Type Ramp 从 Caption 68px…到 Body 14px，语义命名。
- 共识：**用语义角色命名字号，而非绝对像素**；层级用尺寸 + 字重 + 字距共同区分。

### 落地建议（语义化字阶）
```
Display   64px / 700 / -2px      /* Hero，慎用 */
H1        44px / 600 / -1.5px
H2        32px / 600 / -1px
H3        24px / 600 / -0.5px
Subtitle  20px / 500 / -0.5px
Body      16px / 400 / -0.2px    /* 基准，行高 1.4–1.5 */
Label     14px / 500
Caption   13px / 400
```

- 行高：正文 **1.4–1.5**，标题 **1.0–1.1**（与站点观察一致）。
- 字重：站点全用 400 偏艺术化；对通用性更强的个人站，建议标题升到 **600** 以增强层级对比（贴近 Fluent / Material 的语义强调）。

---

## 3. 色彩体系 Color

### 观察
- 中性色主导：背景 `#dbdbdb`、主表面 `#efefef`、次表面 `#eaeaea`、卡片 `#ffffff`。
- 文字三级：主 `#333333`、正文 `#6d6d6d`、三级 `#a5a5a5`。
- 强调色仅一种橙：`#e27500`（交互态 `#e28800`），且只出现在关键词、评分、主 CTA。
- 深色仅用于底部导航外壳 `#000000` / `#141617`。

### 通用规范
- **Apple**：语义色（label / secondaryLabel / tertiaryLabel、systemBackground 分层），强调色用单一 accentColor，正文与背景对比需满足可读性。
- **Fluent / Material**：token 分为 Neutral（背景/表面分层）+ Brand/Accent（强调）+ 语义状态色，强制满足 **WCAG AA 对比度 4.5:1（正文）/ 3:1（大字与图形）**。

### 落地建议（语义化色板 + 对比校验）
```
/* Neutral */
--bg:            #dbdbdb   /* 页面背景 */
--surface:       #efefef   /* 主表面 */
--surface-2:     #eaeaea   /* 次表面 */
--surface-card:  #ffffff   /* 卡片 */
--text-primary:  #333333   /* 对 #efefef 约 9:1 ✓ AA */
--text-secondary:#6d6d6d   /* 对 #efefef 约 4.5:1 ✓ AA 临界 */
--text-tertiary: #a5a5a5   /* 仅用于装饰/占位，正文勿用 ✗ */

/* Accent */
--accent:        #e27500
--accent-hover:  #e28800

/* Ink（深色控件） */
--ink:           #000000
--ink-surface:   #141617
```

- **对比度红线**：`#a5a5a5` 在浅灰上不达 AA，只能做占位/分隔，不可承载正文（符合三系统的无障碍要求）。
- **强调色纪律**：橙色单页出现频次控制在「一个关键词 + 一个主按钮 + 少量状态」——即 Apple「单一 accent」与 Fluent「brand 稀缺化」的做法。

---

## 4. 圆角与阴影 Radius & Elevation

### 观察
- 圆角阶梯：`10`（社交图标）/ `12`（评价卡）/ `20`（次级块）/ `24`（人像卡）/ `30`（按钮）/ `100`（胶囊导航）px。
- 阴影仅两种：人像卡 `0px 6px 32px rgba(0,0,0,0.15)`、浅色块 `2px 2px 70px 33px #eaeaea`。

### 通用规范
- **Apple**：连续圆角（continuous corner），大面积容器圆角更大，控件用胶囊形（pill）。
- **Fluent**：Elevation 分级（2/4/8/16dp…）表达层次；圆角 token 化（4/8 corner radius）。
- **Material 3**：Elevation 通过阴影 + tonal 表面双通道表达。

### 落地建议（规范化 token）
```
--radius-sm:   8px     /* 小图标、tag */
--radius-md:   12px    /* 卡片 */
--radius-lg:   24px    /* 大图 / 人像卡 */
--radius-pill: 999px   /* 按钮、胶囊导航 */

--elevation-1: 0 1px 2px rgba(0,0,0,0.08);      /* 常态卡片 */
--elevation-2: 0 6px 32px rgba(0,0,0,0.15);     /* 悬浮主体（沿用站点人像卡）*/
```

- 阴影**总量克制**：一个页面 1–2 档 elevation 足够，避免层次噪音（对齐 Apple「深度服务于内容」）。
- 圆角**语义分层**：控件用 pill，容器用中等圆角，保持一致节奏。

---

## 5. 组件规范 Components

### 观察
| 组件 | 尺寸 | 圆角 | 关键样式 |
| --- | --- | --- | --- |
| 主 CTA | 168×40 | 30px | 填充 `#e27500`，文字 `#eaeaea` |
| 次级按钮 | 127/141×42 | 30px | `1px solid #333`，填充 `#eaeaea` |
| 社交图标 | 39×39 | 10px | `1px solid #dbdbdb` |
| 底部固定导航 | 528×52 | 100px | 外壳 `#000000`，链接 15/21 |

### 通用规范
- **Apple**：控件最小命中 `44×44pt`；按钮有清晰的 filled / tinted / bordered / plain 层级。
- **Fluent / Material**：按钮语义分级 = Primary（填充）/ Secondary（描边）/ Subtle（无边）；状态齐全（hover / pressed / focus / disabled）。

### 落地建议
- **按钮三级**：
  - Primary = 填充强调色（每屏至多一个）；
  - Secondary = 描边 + 中性填充；
  - Tertiary = 纯文字。
- 高度统一 **40–44px**；触摸端补足到 44px。
- **必须补齐状态**：default / hover / pressed / **focus-visible** / disabled——站点已实现 `:focus-visible`，与三系统的键盘可达性要求一致，务必保留。

---

## 6. 动效 Motion

### 观察
- 过渡时长：颜色/背景/描边 `0.2s`，transform/filter `0.3s`，opacity/transform `0.4s`。
- 缓动：`cubic-bezier(0.21, 0.6, 0.35, 1)`（快进慢出）。
- 已实现 `prefers-reduced-motion`。

### 通用规范
- **Apple**：动效需有目的、可被 Reduce Motion 关闭；用于反馈与连续性，而非炫技。
- **Fluent**：Motion 表达深度与连续性；标准时长区间 `100–400ms`，进入用减速缓动。
- **Material**：Standard easing + 分级 duration token。

### 落地建议（token 化时长与缓动）
```
--motion-fast:   150ms   /* 颜色 / 状态反馈 */
--motion-base:   250ms   /* transform / 显隐 */
--motion-slow:   400ms   /* 滚动进入 */
--ease-standard: cubic-bezier(0.21, 0.6, 0.35, 1);
```

- 动效范围：**hover、滚动进入、轻微 opacity/transform**；避免重 3D、scroll-jacking。
- **无障碍红线**：必须响应 `prefers-reduced-motion`，降级为无位移的淡入（三系统硬性要求）。

---

## 7. 布局与信息架构 Layout & IA

### 观察（Taste DNA）
1. **留白负责框架**：用大面积灰底 + 排版分组，而非盒子/分割线/密集卡片。
2. **强调色像标点**：橙色只在关键处出现，像「指令标记」。
3. **控件很小、存在感强**：底部胶囊导航常驻可达，第一眼仍是内容。
4. **真人证明替代抽象装饰**：真实人像 + 客户数/评价，胜过抽象插画。

### 通用规范
- **Apple**：Deference——UI 让位于内容；导航轻量、内容为王。
- **Fluent / Material**：可预期的信息层级，导航可持续可达但不喧宾夺主。

### 落地建议
- 首屏结构 = **大标题 + 一段短简介 + 一个主 CTA + 一张个人图**，不堆缩略图。
- 单列文本 **500–560px**，靠留白与滚动距离分区，不靠边框。
- 导航做**底部固定胶囊**（≈528×52，pill 圆角），文案按需：`Home / Work / About / Contact`。
- 用**真人照 + 可量化证明**（客户数、项目数、社交链接）建立可信度。

---

## 8. 无障碍 Accessibility（贯穿全篇的红线）

三大系统均将无障碍列为不可协商项，本站已具备的信号应作为基线保留：

- ✅ **`:focus-visible`**：键盘焦点可见 —— 保留并覆盖所有交互控件。
- ✅ **`prefers-reduced-motion`**：动效可降级 —— 保留。
- ⚠️ **对比度**：正文文字须 ≥ 4.5:1，大字/图形 ≥ 3:1；`#a5a5a5` 不达标，禁用于正文。
- ⚠️ **命中区域**：交互目标 ≥ 44×44px（触摸端）。

---

## 附：Design Token 速查表

```css
:root {
  /* Spacing (4px base) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-8: 48px; --space-12: 88px;

  /* Color */
  --bg: #dbdbdb; --surface: #efefef; --surface-2: #eaeaea; --surface-card: #ffffff;
  --text-primary: #333333; --text-secondary: #6d6d6d; --text-tertiary: #a5a5a5;
  --accent: #e27500; --accent-hover: #e28800;
  --ink: #000000; --ink-surface: #141617;

  /* Radius */
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 24px; --radius-pill: 999px;

  /* Elevation */
  --elevation-1: 0 1px 2px rgba(0,0,0,0.08);
  --elevation-2: 0 6px 32px rgba(0,0,0,0.15);

  /* Motion */
  --motion-fast: 150ms; --motion-base: 250ms; --motion-slow: 400ms;
  --ease-standard: cubic-bezier(0.21, 0.6, 0.35, 1);

  /* Layout */
  --content-width: 540px;
  --page-padding: 32px;
}
```
