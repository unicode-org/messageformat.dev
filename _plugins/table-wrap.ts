import MarkdownIt from "npm:markdown-it";

function tableWrap(md: MarkdownIt) {
  md.renderer.rules.table_open = function () {
    return '<div class="table-wrapper"><table>';
  };

  md.renderer.rules.table_close = function () {
    return "</table></div>";
  };
}

export default tableWrap;
