import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { I18nProvider } from "~/i18n";
import "./app.css";

export default function App() {
  return (
    <Router
      root={props => (
        <Suspense>
          {/* 语言上下文放在路由根里：整站（含 404 页）共用同一份文案与切换状态 */}
          <I18nProvider>{props.children}</I18nProvider>
        </Suspense>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
