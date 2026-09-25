/**
 * 文案里「带 id 的条目」的 id 集合。
 *
 * 有些分区是「一段文案 + 一个图标 / 一张界面示意图」，两者必须成对出现。
 * 如果把它们放在两个数组里按下标对齐，将来谁多写一条、少写一条，或者只是
 * 调换顺序，就会出现「书架的文字配着设置页的截图」这种没人会报错的问题。
 * 所以这类条目按 id 组织：**顺序与图标绑定写在组件里**（那里才关心排版），
 * 文案由字典按同一个 id 提供 —— 缺一条、多一条、写错 id 都是编译错误。
 *
 * 纯文字的列表（FAQ、下载页的小提示）仍然用数组：它们不需要和任何东西对齐，
 * 顺序就是译文自己的顺序。
 */

/** 功能卡片（`Features.tsx`） */
export type FeatureId = "shelf" | "discover" | "sources" | "tts" | "import" | "offline";

/** 界面巡览的每一屏（`Showcase.tsx`），id 同时决定配哪张示意图 */
export type ShowcaseId = "shelf" | "reader" | "discover" | "sources" | "settings";

/** 书源引擎的能力卡片（`BookSources.tsx`） */
export type SourceCapabilityId = "api" | "sandbox" | "live" | "groups" | "login" | "import";
