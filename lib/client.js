window.__ModuleLoader__.load({
  id: 'dsh-plugin-table-zoom',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    // ------------------------------------------------------------------
    // 样式：一次注入 <style>，类名 dstz-*，全部走主题 CSS 变量。
    // ------------------------------------------------------------------
    var CSS = [
      '.dstz-row{display:flex;justify-content:flex-end;margin-top:2px}',
      '.dstz-btn{appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px;border:1px solid var(--dsw-alias-border-l2-darkmode-thin);background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:999px;font-size:12px;line-height:18px;padding:3px 10px;font-family:inherit;white-space:nowrap}',
      '.dstz-btn:hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-interactive-bg-active);background:var(--dsw-alias-interactive-bg-hover)}',
      '.dstz-btn:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-active);outline-offset:1px}',
      '.dstz-popup{position:fixed;inset:0;z-index:9999;background:rgba(8,10,18,.55)}',
      '.dstz-panel{box-sizing:border-box;background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2-darkmode-thin);border-radius:16px;box-shadow:var(--dsw-shadow-lv2);color:var(--dsw-alias-label-primary);width:min(92vw,960px);max-height:min(84vh,720px);flex-direction:column;display:flex;overflow:hidden;position:fixed}',
      '.dstz-panel,.dstz-panel *{box-sizing:border-box}',
      '.dstz-panel.dstz-resizing,.dstz-panel.dstz-resizing *{user-select:none;-webkit-user-select:none}',
      '.dstz-header{flex-shrink:0;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid var(--dsw-alias-border-l2);padding:10px 12px 10px 18px;display:flex;cursor:move;touch-action:none}',
      '.dstz-header.dstz-dragging{cursor:grabbing;user-select:none;-webkit-user-select:none}',
      '.dstz-header button{cursor:pointer}',
      '.dstz-title{margin:0;font-size:14px;font-weight:500;line-height:20px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dstz-title small{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;margin-left:8px}',
      '.dstz-headerActions{flex-shrink:0;align-items:center;gap:8px;display:flex}',
      '.dstz-body{overscroll-behavior:contain;flex:auto;min-height:0;padding:14px 18px 18px;overflow-x:auto;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-scrollbar-hover-l2, rgba(148,163,184,.65)) transparent}',
      '.dstz-body::-webkit-scrollbar{width:9px;height:9px}',
      '.dstz-body::-webkit-scrollbar-thumb{background:var(--dsw-alias-scrollbar-hover-l2, rgba(148,163,184,.65));border-radius:7px;border:2px solid var(--dsw-specific-input-major);background-clip:padding-box}',
      '.dstz-body::-webkit-scrollbar-thumb:hover{background:var(--dsw-alias-label-secondary, rgba(148,163,184,.95))}',
      '.dstz-body::-webkit-scrollbar-track{background:transparent}',
      '.dstz-body::-webkit-scrollbar-corner{background:transparent}',
      '.dstz-body.dstz-grabbable{cursor:grab}',
      '.dstz-body.dstz-panning{cursor:grabbing;user-select:none;-webkit-user-select:none}',
      '.dstz-table{border-collapse:collapse;width:max-content;max-width:max-content;color:var(--dsw-alias-label-primary)}',
      // 列宽上限与核心渲染器（tableScroll）一致：超宽列在浮窗内收缩换行，整体不溢出
      '.dstz-table th{text-align:start;padding:8px 14px;border-bottom:1px solid var(--dsw-alias-border-l3);font:var(--dsw-font-markdown-table-head);max-width:min(30vw,320px);min-width:100px}',
      '.dstz-table td{padding:8px 14px;border-bottom:1px solid var(--dsw-alias-border-l2);font:var(--dsw-font-markdown-table);max-width:min(30vw,320px);min-width:100px}',
      '.dstz-table tr:last-child td{border-bottom:none}',
      '.dstz-iconButton{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:999px;place-items:center;display:grid;font-size:15px;line-height:1;padding:0}',
      '.dstz-iconButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dstz-iconButton:focus-visible{outline:2px solid var(--dsw-alias-interactive-bg-active);outline-offset:1px}',
      '.dstz-copyBtn{appearance:none;cursor:pointer;border-radius:999px;border:1px solid var(--dsw-alias-border-l2-darkmode-thin);background:0 0;color:var(--dsw-alias-label-primary);font-size:12px;line-height:18px;padding:3px 10px;font-family:inherit;white-space:nowrap}',
      '.dstz-copyBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}',
      '.dstz-copyBtn:disabled{cursor:default;opacity:.55}',
      // 拖拽改尺寸：右下角手柄（悬停显示，不占滚动条位置）
      '.dstz-resizeSE{position:absolute;right:2px;bottom:2px;width:22px;height:22px;cursor:nwse-resize;z-index:4;touch-action:none}',
      '.dstz-resizeSE::after{content:"";position:absolute;right:5px;bottom:5px;width:9px;height:9px;border-right:2px solid var(--dsw-alias-label-tertiary);border-bottom:2px solid var(--dsw-alias-label-tertiary);border-bottom-right-radius:2px;pointer-events:none}',
      '.dstz-resizeSE:hover::after,.dstz-panel.dstz-resizing .dstz-resizeSE::after{border-color:var(--dsw-alias-label-primary)}',
      '@media (width<=720px){.dstz-panel{width:min(96vw,960px);max-height:88vh}.dstz-body{padding:10px 12px 12px}}',
      // rc2 兼容：dsh 0.1.1-rc.2 起核心渲染器给 4+ 列宽表额外加上 `md-table-wide`——
      // 默认 overflow-x:hidden（仅 hover/focus-visible 才出滚动条），且
      // AssistantMarkdown 配套规则把表格宽度扩展到聊天内容列两侧留白区
      // （.Sxvs8a_body .md-table-wide 的 width/margin/padding 联动）。
      // 这里把宽表拉回内容列宽度并常驻横向滚动条，恢复 0.1.0-rc.8 及以前
      // 「超宽在会话列内滚动查看」的行为；旧版 dsh 无 md-table-wide 类，规则不命中。
      '[class*="tableScroll"].md-table-wide{box-sizing:border-box;width:auto!important;max-width:100%!important;margin-left:0!important;padding-left:0!important;padding-bottom:0!important;overflow-x:auto!important}'
    ].join('');
    var tagId = 'dsh-plugin-table-zoom/zoom.module.css';
    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css=' + JSON.stringify(tagId) + ']') === null) {
      var tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-plugin-table-zoom';
      tag.dataset.pluginCss = tagId;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    // ------------------------------------------------------------------
    // 常量与文案
    // ------------------------------------------------------------------
    /** 行数（含表头）达到该值即视为“长表”，注入浮窗按钮。 */
    var MIN_ROWS = 9;
    /** 超过该像素视为横向溢出（表太宽），也注入按钮。 */
    var OVERFLOW_PX = 2;
    /** markdown 表格容器类名片段（核心渲染器 tableScroll，CSS Module 哈希前缀）。 */
    var TABLE_WRAP_HINT = 'tableScroll';

    /** 页面语言是否中文（决定按钮/浮窗文案）。 */
    function isZh() {
      return typeof document !== 'undefined' && (document.documentElement.lang || '').toLowerCase().indexOf('zh') === 0;
    }
    var zh = isZh();
    var LABELS = {
      open: zh ? '\u6d6e\u7a97\u67e5\u770b' : 'Open in popup',
      title: zh ? '\u8868\u683c' : 'Table',
      rowsCols: zh ? '\u884c \u00d7 \u5217' : 'rows \u00d7 cols',
      copy: zh ? '\u590d\u5236\u4e3a Markdown' : 'Copy as Markdown',
      copied: zh ? '\u5df2\u590d\u5236' : 'Copied',
      copyFailed: zh ? '\u590d\u5236\u5931\u8d25' : 'Copy failed',
      close: zh ? '\u5173\u95ed' : 'Close'
    };

    // ------------------------------------------------------------------
    // 纯函数（导出供 selfcheck / smoke 测试）
    // ------------------------------------------------------------------

    /**
     * 判断一个 <table> 是否位于 markdown 表格容器内（核心渲染器把表格包在
     * `.tableScroll` 样式的 div 里，类名为 CSS Module 哈希，用属性包含匹配）。
     * @param {object} table - <table> 元素（或测试用假对象，须有 closest 方法）。
     * @returns {boolean}
     */
    function isMarkdownTable(table) {
      if (table === null || typeof table !== 'object' || typeof table.closest !== 'function') return false;
      return table.closest('[class*="' + TABLE_WRAP_HINT + '"]') !== null;
    }

    /**
     * 判断表格是否“长”（行数多或横向溢出）而值得注入浮窗按钮。
     * @param {object} table - <table> 元素（须有 rows 数组/类数组，rows[0].cells）。
     * @param {object} wrap - 表格容器（须有 scrollWidth / clientWidth）。
     * @returns {boolean}
     */
    function isLongTable(table, wrap) {
      if (table === null || typeof table !== 'object') return false;
      var rows = table.rows;
      var rowCount = rows === null || rows === void 0 ? 0 : rows.length;
      if (rowCount >= MIN_ROWS) return true;
      if (wrap !== null && typeof wrap === 'object') {
        var sw = typeof wrap.scrollWidth === 'number' ? wrap.scrollWidth : 0;
        var cw = typeof wrap.clientWidth === 'number' ? wrap.clientWidth : 0;
        if (sw > cw + OVERFLOW_PX) return true;
      }
      return false;
    }

    /**
     * 把 <table> 序列化为 Markdown 文本（单元格内联换行/管道转义），
     * 供「复制为 Markdown」使用。纯函数，可离线测试。
     * @param {object} table - <table> 元素（须有 rows，rows[i].cells，cell.textContent）。
     * @returns {string}
     */
    function tableToMarkdown(table) {
      if (table === null || typeof table !== 'object' || table.rows === null || table.rows === void 0) return '';
      var rows = [];
      for (var r = 0; r < table.rows.length; r++) {
        var tr = table.rows[r];
        var cells = tr.cells === null || tr.cells === void 0 ? [] : tr.cells;
        var row = [];
        for (var c = 0; c < cells.length; c++) {
          var text = cells[c].textContent === null || cells[c].textContent === void 0 ? '' : String(cells[c].textContent);
          row.push(text.replace(/\s*\n\s*/g, ' ').trim().replace(/\|/g, '\\|'));
        }
        rows.push(row);
      }
      if (rows.length === 0) return '';
      var width = 0;
      for (var i = 0; i < rows.length; i++) width = Math.max(width, rows[i].length);
      var lines = [];
      var pad = function (row) {
        var out = [];
        for (var j = 0; j < width; j++) out.push(j < row.length ? row[j] : '');
        return out;
      };
      var line = function (row) { return '| ' + pad(row).join(' | ') + ' |'; };
      lines.push(line(rows[0]));
      var sep = [];
      for (var k = 0; k < width; k++) sep.push('---');
      lines.push('| ' + sep.join(' | ') + ' |');
      for (var m = 1; m < rows.length; m++) lines.push(line(rows[m]));
      return lines.join('\n');
    }

    // ------------------------------------------------------------------
    // 浮窗：命令式 DOM（复用 image-tools lightbox 模式，不触碰 React 结构）
    // ------------------------------------------------------------------
    var activePopup = null;
    var lastTrigger = null;

    /** 关闭当前浮窗并还原页面滚动。 */
    function closePopup() {
      if (activePopup === null) return;
      var popup = activePopup;
      activePopup = null;
      if (typeof popup._onKey === 'function') document.removeEventListener('keydown', popup._onKey);
      if (Array.isArray(popup._cleanups)) {
        for (var i = 0; i < popup._cleanups.length; i++) {
          try { popup._cleanups[i](); } catch (e) { /* ignore */ }
        }
      }
      popup.remove();
      // 仅当 body.style.overflow 仍是我们打开时设置的值才还原：
      // 期间其它组件（如图片 lightbox）可能又改写过该属性，不能覆盖别人的状态。
      if (lastTrigger !== null && document.body.style.overflow === lastTrigger.appliedOverflow) {
        document.body.style.overflow = lastTrigger.bodyOverflow !== void 0 ? lastTrigger.bodyOverflow : '';
      }
      lastTrigger = null;
    }

    /** 复制文本到剪贴板（clipboard API，失败时 execCommand 兜底）。@returns {Promise<boolean>} */
    function copyText(text) {
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
      }
      return Promise.resolve(legacyCopy(text));
    }

    /** 旧式复制兜底（textarea + execCommand）。 */
    function legacyCopy(text) {
      if (typeof document === 'undefined') return false;
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        ta.remove();
        return ok;
      } catch (e) {
        return false;
      }
    }

    // ------------------------------------------------------------------
    // 浮窗布局：拖拽改大小 + 拖标题栏移动 + Ctrl+滚轮缩放
    // 不记忆任何布局：每次打开都按表格内容自适应宽度并居中，手动拖拽只影响当次。
    // ------------------------------------------------------------------

    var MIN_POPUP_W = 320;
    var MIN_POPUP_H = 200;
    /** 浮窗距视口边缘的最小留白。 */
    var POPUP_MARGIN = 48;
    /** Ctrl+滚轮缩放范围与步进。 */
    var ZOOM_MIN = 0.6;
    var ZOOM_MAX = 2.5;
    var ZOOM_STEP = 0.1;

    /** 把 v 限制在 [lo, hi]。 */
    function clamp(v, lo, hi) {
      return Math.min(Math.max(v, lo), hi);
    }

    /** 当前视口宽（无 DOM 环境兜底 1280）。 */
    function viewportW() {
      if (typeof window !== 'undefined' && typeof window.innerWidth === 'number' && window.innerWidth > 0) return window.innerWidth;
      if (typeof document !== 'undefined' && document.documentElement !== null && typeof document.documentElement.clientWidth === 'number' && document.documentElement.clientWidth > 0) return document.documentElement.clientWidth;
      return 1280;
    }

    /** 当前视口高（无 DOM 环境兜底 800）。 */
    function viewportH() {
      if (typeof window !== 'undefined' && typeof window.innerHeight === 'number' && window.innerHeight > 0) return window.innerHeight;
      if (typeof document !== 'undefined' && document.documentElement !== null && typeof document.documentElement.clientHeight === 'number' && document.documentElement.clientHeight > 0) return document.documentElement.clientHeight;
      return 800;
    }

    /**
     * 每次打开都按表格自然宽度自适应面板宽度
     * （正文左右 padding 36 + 面板边框 2；下限 320，上限为视口减去留白——
     * 超级大表直接铺满最大可用宽度）。
     */
    function applyAdaptiveWidth(panel, clone) {
      var tableW = typeof clone.offsetWidth === 'number' && clone.offsetWidth > 0 ? clone.offsetWidth : 0;
      var maxW = viewportW() - POPUP_MARGIN;
      var w = clamp(tableW + 38, MIN_POPUP_W, Math.max(MIN_POPUP_W, maxW));
      panel.style.width = w + 'px';
    }

    /** 把面板按实际尺寸重新居中（自适应改宽后调用；测不到尺寸时跳过）。 */
    function centerPanel(panel) {
      var w = panel.offsetWidth;
      var h = panel.offsetHeight;
      if (typeof w !== 'number' || w <= 0 || typeof h !== 'number' || h <= 0) return;
      panel.style.left = Math.round((viewportW() - w) / 2) + 'px';
      panel.style.top = Math.round((viewportH() - h) / 2) + 'px';
    }

    /** 把面板位置限制在视口内（完全可见，不越出页面）。 */
    function clampPanelPosition(panel) {
      var rect = null;
      try { rect = panel.getBoundingClientRect(); } catch (err) { rect = null; }
      if (rect === null || typeof rect !== 'object') return;
      if (typeof rect.left !== 'number' || typeof rect.top !== 'number') return;
      var x = clamp(rect.left, 0, Math.max(0, viewportW() - rect.width));
      var y = clamp(rect.top, 0, Math.max(0, viewportH() - rect.height));
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
    }

    /** 把面板移到 (x, y) 并限制在视口内。 */
    function setPanelPosition(panel, x, y) {
      var rect = null;
      try { rect = panel.getBoundingClientRect(); } catch (err) { rect = null; }
      if (rect === null || typeof rect !== 'object') return;
      x = clamp(x, 0, Math.max(0, viewportW() - rect.width));
      y = clamp(y, 0, Math.max(0, viewportH() - rect.height));
      panel.style.left = x + 'px';
      panel.style.top = y + 'px';
    }

    /**
     * 内容溢出且按住空格（平移预备）时才给正文加 grab 光标提示。
     * 空格状态由 attachPan 维护在 body._dstzSpaceArmed 上；
     * 布局变化（打开/改尺寸/缩放）后调用本函数即可同步光标。
     */
    function refreshGrabbable(body) {
      var overX = body.scrollWidth > body.clientWidth + 1;
      var overY = body.scrollHeight > body.clientHeight + 1;
      if ((overX || overY) && body._dstzSpaceArmed === true) {
        body.classList.add('dstz-grabbable');
      } else {
        body.classList.remove('dstz-grabbable');
      }
    }

    /** 命中可交互元素（链接/按钮/输入框等）时让给默认行为，不启动拖拽。 */
    function isInteractive(el) {
      if (el === null || typeof el !== 'object' || typeof el.closest !== 'function') return false;
      return el.closest('a,button,input,textarea,select,[contenteditable="true"],[role="button"]') !== null;
    }

    /**
     * 给面板挂载「拖右下角改尺寸」：指针捕获 + _suppressClick 防止拖完
     * 松手落在遮罩上误触发关闭。尺寸只影响当次打开，不持久化。
     * @param {object} panel - .dstz-panel 元素。
     * @param {object} overlay - .dstz-popup 元素（承载 _suppressClick）。
     */
    function attachResize(panel, overlay) {
      var handle = document.createElement('div');
      handle.className = 'dstz-resizeSE';
      handle.setAttribute('aria-hidden', 'true');
      var state = null;
      var begin = function (e) {
        if (e.button !== 0) return;
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        var rect = null;
        try { rect = panel.getBoundingClientRect(); } catch (err) { rect = null; }
        if (rect === null || typeof rect !== 'object') return;
        state = { x: e.clientX, y: e.clientY, w: rect.width, h: rect.height };
        panel.style.maxHeight = 'none';
        panel.classList.add('dstz-resizing');
        overlay._suppressClick = true;
        if (e.currentTarget !== null && e.currentTarget !== void 0 && typeof e.currentTarget.setPointerCapture === 'function') {
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      };
      var move = function (e) {
        if (state === null) return;
        var dx = e.clientX - state.x;
        var dy = e.clientY - state.y;
        var w = Math.min(Math.max(state.w + dx, MIN_POPUP_W), Math.max(MIN_POPUP_W, viewportW() - POPUP_MARGIN));
        var h = Math.min(Math.max(state.h + dy, MIN_POPUP_H), Math.max(MIN_POPUP_H, viewportH() - POPUP_MARGIN));
        panel.style.width = w + 'px';
        panel.style.height = h + 'px';
        if (typeof e.preventDefault === 'function') e.preventDefault();
      };
      var end = function () {
        if (state === null) return;
        state = null;
        panel.classList.remove('dstz-resizing');
        clampPanelPosition(panel);
        window.setTimeout(function () { overlay._suppressClick = false; }, 0);
      };
      handle.addEventListener('pointerdown', begin);
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
      panel.appendChild(handle);
    }

    /**
     * 给标题栏挂载「拖拽移动」：按住标题栏（按钮除外）拖动面板位置，
     * 位置限制在视口内（不越出页面）；位置不记忆，下次打开重新居中。
     * @param {object} panel - .dstz-panel 元素（children[0] 为标题栏）。
     * @param {object} overlay - .dstz-popup 元素（承载 _suppressClick）。
     */
    function attachMove(panel, overlay) {
      var header = panel.children[0];
      if (header === null || header === void 0) return;
      var state = null;
      header.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        if (isInteractive(e.target)) return;
        var rect = null;
        try { rect = panel.getBoundingClientRect(); } catch (err) { rect = null; }
        if (rect === null || typeof rect !== 'object') return;
        state = { x: e.clientX, y: e.clientY, lx: rect.left, ty: rect.top, moved: false };
        if (typeof header.setPointerCapture === 'function') {
          try { header.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      });
      header.addEventListener('pointermove', function (e) {
        if (state === null) return;
        var dx = e.clientX - state.x;
        var dy = e.clientY - state.y;
        if (!state.moved && Math.abs(dx) + Math.abs(dy) < 3) return;
        if (!state.moved) {
          state.moved = true;
          header.classList.add('dstz-dragging');
          overlay._suppressClick = true;
        }
        setPanelPosition(panel, state.lx + dx, state.ty + dy);
        if (typeof e.preventDefault === 'function') e.preventDefault();
      });
      var end = function () {
        if (state === null) return;
        var wasMoved = state.moved;
        state = null;
        header.classList.remove('dstz-dragging');
        if (wasMoved) window.setTimeout(function () { overlay._suppressClick = false; }, 0);
      };
      header.addEventListener('pointerup', end);
      header.addEventListener('pointercancel', end);
    }

    /**
     * 给正文挂载「按住空格拖动平移」：内容溢出时，按住空格再按住表格
     * 左右/上下拖动即可滚动（鼠标/触控笔；触屏保留原生滚动）。
     * 普通左键拖动不再被平移劫持，而是保留浏览器原生行为——可在表格
     * （含放大后）里直接框选文字；只有按住空格时拖动才平移。
     * grab 光标仅在按住空格悬停正文且内容溢出时出现；
     * 拖动结束松手落在遮罩上不会误关浮窗。
     * @param {object} body - .dstz-body 元素。
     * @param {object} overlay - .dstz-popup 元素（承载 _suppressClick / _cleanups）。
     */
    function attachPan(body, overlay) {
      var state = null;
      var endPan = function () {
        if (state === null) return;
        state = null;
        body.classList.remove('dstz-panning');
        window.setTimeout(function () { overlay._suppressClick = false; }, 0);
      };
      var setArmed = function (on) {
        body._dstzSpaceArmed = on === true;
        refreshGrabbable(body);
      };
      var onKeyDown = function (e) {
        if (e.key === ' ' || e.code === 'Space') setArmed(true);
      };
      var onKeyUp = function (e) {
        if (e.key === ' ' || e.code === 'Space') {
          setArmed(false);
          if (state !== null) endPan(); // 拖动中松开空格：结束平移
        }
      };
      var onBlur = function () {
        setArmed(false);
        if (state !== null) endPan();
      };
      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('keydown', onKeyDown, true);
        window.addEventListener('keyup', onKeyUp, true);
        window.addEventListener('blur', onBlur);
        if (Array.isArray(overlay._cleanups)) {
          overlay._cleanups.push(function () {
            window.removeEventListener('keydown', onKeyDown, true);
            window.removeEventListener('keyup', onKeyUp, true);
            window.removeEventListener('blur', onBlur);
            setArmed(false);
          });
        }
      }
      body.addEventListener('pointerdown', function (e) {
        if (e.button !== 0) return;
        if (e.pointerType !== undefined && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        if (!body._dstzSpaceArmed) return; // 未按住空格：让给浏览器原生文本选择（框选文字）
        if (isInteractive(e.target)) return;
        var overX = body.scrollWidth > body.clientWidth + 1;
        var overY = body.scrollHeight > body.clientHeight + 1;
        if (!overX && !overY) return;
        if (typeof e.preventDefault === 'function') e.preventDefault();
        state = { x: e.clientX, y: e.clientY, sl: body.scrollLeft, st: body.scrollTop };
        body.classList.add('dstz-panning');
        overlay._suppressClick = true;
        if (typeof body.setPointerCapture === 'function') {
          try { body.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
        }
      });
      body.addEventListener('pointermove', function (e) {
        if (state === null) return;
        var dx = e.clientX - state.x;
        var dy = e.clientY - state.y;
        body.scrollLeft = state.sl - dx;
        body.scrollTop = state.st - dy;
        if (typeof e.preventDefault === 'function') e.preventDefault();
      });
      body.addEventListener('pointerup', endPan);
      body.addEventListener('pointercancel', endPan);
    }

    /**
     * 打开表格浮窗：可滚动容器 + 表格克隆 + 头部（标题/行列数/复制/关闭）。
     * 克隆而不是移动原表格，聊天里的表格保持不变。
     * @param {object} table - 原始 <table> 元素。
     */
    function openPopup(table) {
      if (typeof document === 'undefined' || table === null || typeof table !== 'object') return;
      closePopup();

      var overlay = document.createElement('div');
      overlay.className = 'dstz-popup';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', LABELS.title);

      var panel = document.createElement('div');
      panel.className = 'dstz-panel';

      var header = document.createElement('header');
      header.className = 'dstz-header';
      var title = document.createElement('h3');
      title.className = 'dstz-title';
      title.textContent = LABELS.title;
      var rowCount = table.rows !== null && table.rows !== void 0 ? table.rows.length : 0;
      var colCount = rowCount > 0 && table.rows[0].cells !== void 0 ? table.rows[0].cells.length : 0;
      var small = document.createElement('small');
      small.textContent = rowCount + ' ' + LABELS.rowsCols + ' ' + colCount;
      title.appendChild(small);

      var actions = document.createElement('div');
      actions.className = 'dstz-headerActions';

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'dstz-copyBtn';
      copyBtn.textContent = LABELS.copy;
      copyBtn.addEventListener('click', function () {
        copyBtn.disabled = true;
        copyText(tableToMarkdown(table)).then(function (ok) {
          copyBtn.textContent = ok ? LABELS.copied : LABELS.copyFailed;
          window.setTimeout(function () {
            copyBtn.textContent = LABELS.copy;
            copyBtn.disabled = false;
          }, 1600);
        });
      });

      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'dstz-iconButton';
      closeBtn.setAttribute('aria-label', LABELS.close);
      closeBtn.title = LABELS.close;
      closeBtn.textContent = '\u2715';
      closeBtn.addEventListener('click', closePopup);

      actions.appendChild(copyBtn);
      actions.appendChild(closeBtn);
      header.appendChild(title);
      header.appendChild(actions);

      var body = document.createElement('div');
      body.className = 'dstz-body';
      var clone = table.cloneNode(true);
      clone.className = 'dstz-table';
      body.appendChild(clone);

      panel.appendChild(header);
      panel.appendChild(body);
      overlay.appendChild(panel);

      // 清理登记（attachPan 等挂载的全局监听会 push 进来，关闭时统一移除）
      overlay._cleanups = [];

      // 拖拽改尺寸 + 拖标题栏移动 + 内容溢出拖拽平移 + Ctrl+滚轮缩放
      attachResize(panel, overlay);
      attachMove(panel, overlay);
      attachPan(body, overlay);

      var zoom = 1;
      var applyZoom = function (z) {
        zoom = clamp(z, ZOOM_MIN, ZOOM_MAX);
        clone.style.zoom = String(zoom);
        small.textContent = rowCount + ' ' + LABELS.rowsCols + ' ' + colCount
          + (Math.abs(zoom - 1) > 0.001 ? ' \u00b7 ' + Math.round(zoom * 100) + '%' : '');
      };
      applyZoom(1); // 不继承上次的缩放，每次都从 100% 开始
      refreshGrabbable(body);

      // Ctrl+滚轮：缩放表格字体（阻止浏览器整页缩放；缩放不写入 localStorage）
      var onWheel = function (e) {
        if (!e.ctrlKey) return;
        if (typeof e.preventDefault === 'function') e.preventDefault();
        applyZoom(e.deltaY < 0 ? zoom + ZOOM_STEP : zoom - ZOOM_STEP);
      };
      panel.addEventListener('wheel', onWheel, { passive: false });

      var onWindowResize = function () {
        var maxW = viewportW() - POPUP_MARGIN;
        var maxH = viewportH() - POPUP_MARGIN;
        var w = panel.offsetWidth;
        var h = panel.offsetHeight;
        if (w > maxW || h > maxH) {
          panel.style.width = Math.min(w, maxW) + 'px';
          panel.style.height = Math.min(h, maxH) + 'px';
        }
        clampPanelPosition(panel);
        refreshGrabbable(body);
      };
      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', onWindowResize);
        overlay._cleanups.push(function () {
          window.removeEventListener('resize', onWindowResize);
        });
      }

      lastTrigger = { bodyOverflow: document.body.style.overflow, appliedOverflow: 'hidden' };
      document.body.style.overflow = 'hidden';

      var onKey = function (event) {
        if (event.key === 'Escape') closePopup();
      };
      overlay.addEventListener('click', function (event) {
        // 拖拽（改尺寸/平移）后松手落在遮罩上会产生一次 click，需吞掉避免误关
        if (overlay._suppressClick) {
          overlay._suppressClick = false;
          return;
        }
        if (event.target === overlay) closePopup();
      });
      document.addEventListener('keydown', onKey);
      overlay._onKey = onKey;

      activePopup = overlay;
      document.body.appendChild(overlay);
      // 每次打开都按表格自然宽度自适应，并按实际尺寸重新居中（不继承上次的尺寸/位置）
      applyAdaptiveWidth(panel, clone);
      centerPanel(panel);
      refreshGrabbable(body);
      closeBtn.focus();
    }

    // ------------------------------------------------------------------
    // 扫描与按钮注入
    // ------------------------------------------------------------------

    /** 为单个表格注入「浮窗查看」按钮（容器后插入一行，右对齐）。 */
    function upgradeTable(table) {
      if (typeof document === 'undefined') return null;
      if (!isMarkdownTable(table)) return null;
      // 跳过浮窗内部（克隆表）与图片 lightbox 内的表格
      if (typeof table.closest === 'function' && table.closest('.dstz-popup') !== null) return null;
      if (typeof table.closest === 'function' && table.closest('.dshpick-lightbox') !== null) return null;

      var wrap = table.closest('[class*="' + TABLE_WRAP_HINT + '"]');
      if (wrap === null || wrap === void 0) return null;
      if (!isLongTable(table, wrap)) return null;

      // 幂等判定：打过标记的表格（已插入按钮行）直接跳过。
      // （旧判定「容器后紧跟兄弟是否 .dstz-row」不可靠——React 重排会把按钮行
      // 挪走或移除，导致同一表格重复插行；dataset 标记跟着表格本身走。）
      if (table.dataset !== void 0 && table.dataset.dstz === '1') return null;

      var parent = wrap.parentNode;
      if (parent === null || parent === void 0) return null;

      var row = document.createElement('div');
      row.className = 'dstz-row';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dstz-btn';
      btn.setAttribute('aria-label', LABELS.open);
      btn.title = LABELS.open;
      var icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '\u26F6';
      var label = document.createElement('span');
      label.textContent = LABELS.open;
      btn.appendChild(icon);
      btn.appendChild(label);
      btn.addEventListener('click', function () { openPopup(table); });
      row.appendChild(btn);

      if (wrap.nextSibling !== null) {
        parent.insertBefore(row, wrap.nextSibling);
      } else {
        parent.appendChild(row);
      }
      if (table.dataset !== void 0) table.dataset.dstz = '1';
      return row;
    }

    /** 全量扫描：对每个候选表格执行 upgradeTable。 */
    function upgradeTables() {
      if (typeof document === 'undefined') return;
      var tables = document.querySelectorAll('table');
      for (var i = 0; i < tables.length; i++) upgradeTable(tables[i]);
    }

    /**
     * 启动表格增强：MutationObserver 观察 body，rAF 合帧扫描。
     * @returns {Function|null} 停止函数；无 DOM 环境返回 null。
     */
    function startEnhancer() {
      if (typeof document === 'undefined' || typeof MutationObserver === 'undefined' || typeof requestAnimationFrame === 'undefined') return null;
      var pending = false;
      var scan = function () {
        pending = false;
        upgradeTables();
      };
      var observer = new MutationObserver(function () {
        if (pending) return;
        pending = true;
        requestAnimationFrame(scan);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      scan();
      return function () {
        observer.disconnect();
        closePopup();
      };
    }

    // ------------------------------------------------------------------
    // 插件入口
    // ------------------------------------------------------------------
    function apply(ctx) {
      ctx.effect(function () {
        return startEnhancer();
      }, 'dsh-plugin-table-zoom: table popup enhancer');
    }

    exports.apply = apply;
    exports.inject = [];
    // 供自检/冒烟测试复用：纯函数与可测入口。
    exports.MIN_ROWS = MIN_ROWS;
    exports.isMarkdownTable = isMarkdownTable;
    exports.isLongTable = isLongTable;
    exports.tableToMarkdown = tableToMarkdown;
    exports.openPopup = openPopup;
    exports.closePopup = closePopup;
    exports.copyText = copyText;
    exports.upgradeTable = upgradeTable;
    exports.upgradeTables = upgradeTables;
    exports.startEnhancer = startEnhancer;
    exports.attachResize = attachResize;
    exports.attachMove = attachMove;
    exports.attachPan = attachPan;
    exports.applyAdaptiveWidth = applyAdaptiveWidth;
    exports.clampPanelPosition = clampPanelPosition;
    exports.refreshGrabbable = refreshGrabbable;
    return module.exports;
  }
});
