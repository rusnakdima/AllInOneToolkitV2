/* sys lib */
import { Routes } from "@angular/router";

/* components */
import { HomeView } from "@views/home/home.view";
import { AboutView } from "@views/about/about.view";
import { SearchPageView } from "@views/search-page/search-page.view";
import { CatalogsView } from "@views/catalogs/catalogs.view";
import { ItemsView } from "@views/items/items.view";

import { NotFoundView } from "@views/not-found/not-found.view";

/* Encoders/Decoders */
import { UrlEncDecView } from "@views/items-pages/url-enc-dec/url-enc-dec.view";
import { Base64EncDecView } from "@views/items-pages/base64-enc-dec/base64-enc-dec.view";
import { Md5EncDecView } from "@views/items-pages/md5-enc-dec/md5-enc-dec.view";
import { Sha256EncDecView } from "@views/items-pages/sha256-enc-dec/sha256-enc-dec.view";

/* Visualisers */
import { VisualDataOnChartView } from "@views/items-pages/visual-data-on-chart/visual-data-on-chart.view";
import { ArrayVisualizerView } from "@views/items-pages/array-visualizer/array-visualizer.view";
import { PieChartView } from "@views/items-pages/pie-chart/pie-chart.view";
import { CsvToTableView } from "@views/items-pages/csv-to-table/csv-to-table.view";
import { JsonToTableView } from "@views/items-pages/json-to-table/json-to-table.view";
import { XmlToTableView } from "@views/items-pages/xml-to-table/xml-to-table.view";
import { PlistToTableView } from "@views/items-pages/plist-to-table/plist-to-table.view";

/* Converters */
import { JsonToXmlView } from "@views/items-pages/json-to-xml/json-to-xml.view";
import { XmlToJsonView } from "@views/items-pages/xml-to-json/xml-to-json.view";
import { XlsToJsonView } from "@views/items-pages/xls-to-json/xls-to-json.view";
import { JsonToXlsView } from "@views/items-pages/json-to-xls/json-to-xls.view";
import { XlsToXmlView } from "@views/items-pages/xls-to-xml/xls-to-xml.view";
import { XmlToXlsView } from "@views/items-pages/xml-to-xls/xml-to-xls.view";
import { ClockConverterView } from "@views/items-pages/clock-converter/clock-converter.view";
import { UnicodeConverterView } from "@views/items-pages/unicode-converter/unicode-converter.view";
import { CssConverterView } from "@views/items-pages/css-converter/css-converter.view";

/* Editors */
import { MarkdownEditorView } from "@views/items-pages/markdown-editor/markdown-editor.view";
import { SvgEditorView } from "@views/items-pages/svg-editor/svg-editor.view";

/* Maths */
import { PrimeNumberView } from "@views/items-pages/prime-number/prime-number.view";

/* Other */
import { WordCounterView } from "@views/items-pages/word-counter/word-counter.view";
import { VirusTotalView } from "@views/items-pages/virus-total/virus-total.view";
import { KeyCodeView } from "@views/items-pages/key-code/key-code.view";
import { ColorPalleteView } from "@views/items-pages/color-pallete/color-pallete.view";
import { WheelFortuneView } from "@views/items-pages/wheel-fortune/wheel-fortune.view";
import { UuidGeneratorView } from "@views/items-pages/uuid-generator/uuid-generator.view";
import { UrlRequestsView } from "@views/items-pages/url-requests/url-requests.view";

const routesLinks: Routes = [
  /* Encoders/Decoders */
  {
    path: "url_enc_dec",
    component: UrlEncDecView,
    title: "URL Encode/Decode",
    data: { breadcrumbs: "URL Encode/Decode" },
  },
  {
    path: "base64_enc_dec",
    component: Base64EncDecView,
    title: "Base64 Encode/Decode",
    data: { breadcrumbs: "Base64 Encode/Decode" },
  },
  {
    path: "md5_enc_dec",
    component: Md5EncDecView,
    title: "MD5 Encode/Decode",
    data: { breadcrumbs: "MD5 Encode/Decode" },
  },
  {
    path: "sha256_enc_dec",
    component: Sha256EncDecView,
    title: "SHA256 Encode/Decode",
    data: { breadcrumbs: "SHA256 Encode/Decode" },
  },

  /* Visualisers */
  {
    path: "visual_data_chart",
    component: VisualDataOnChartView,
    title: "Visualization data on chart",
    data: { breadcrumbs: "Visualization data on chart" },
  },
  {
    path: "array_visualizer",
    component: ArrayVisualizerView,
    title: "Array Visualizer",
    data: { breadcrumbs: "Array Visualizer" },
  },
  {
    path: "pie_chart",
    component: PieChartView,
    title: "Pie Chart",
    data: { breadcrumbs: "Pie Chart" },
  },
  {
    path: "csv_to_table",
    component: CsvToTableView,
    title: "CSV visualizer in Table",
    data: { breadcrumbs: "CSV visualizer in Table" },
  },
  {
    path: "json_to_table",
    component: JsonToTableView,
    title: "JSON visualizer in Table",
    data: { breadcrumbs: "JSON visualizer in Table" },
  },
  {
    path: "xml_to_table",
    component: XmlToTableView,
    title: "XML visualizer in Table",
    data: { breadcrumbs: "XML visualizer in Table" },
  },
  {
    path: "plist_to_table",
    component: PlistToTableView,
    title: "Plist Viewer",
    data: { breadcrumbs: "Plist Viewer" },
  },

  /* Converters */
  {
    path: "json_to_xml",
    component: JsonToXmlView,
    title: "Convert JSON to XML",
    data: { breadcrumbs: "Convert" },
  },
  {
    path: "xml_to_json",
    component: XmlToJsonView,
    title: "Convert XML to JSON",
    data: { breadcrumbs: "Convert XML to JSON" },
  },
  {
    path: "xls_to_json",
    component: XlsToJsonView,
    title: "Convert XLS to JSON",
    data: { breadcrumbs: "Convert XLS to JSON" },
  },
  {
    path: "json_to_xls",
    component: JsonToXlsView,
    title: "Convert JSON to XLS",
    data: { breadcrumbs: "Convert JSON to XLS" },
  },
  {
    path: "xls_to_xml",
    component: XlsToXmlView,
    title: "Convert XLS to XML",
    data: { breadcrumbs: "Convert XLS to XML" },
  },
  {
    path: "xml_to_xls",
    component: XmlToXlsView,
    title: "Convert XML to XLS",
    data: { breadcrumbs: "Convert XML to XLS" },
  },
  {
    path: "clock_converter",
    component: ClockConverterView,
    title: "Clock Converter",
    data: { breadcrumbs: "Clock Converter" },
  },
  {
    path: "unicode_converter",
    component: UnicodeConverterView,
    title: "Unicode Converter",
    data: { breadcrumbs: "Unicode Converter" },
  },
  {
    path: "css_converter",
    component: CssConverterView,
    title: "CSS Converter",
    data: { breadcrumbs: "CSS Converter" },
  },

  /* Editors */
  {
    path: "md_editor",
    component: MarkdownEditorView,
    title: "Markdown Editor",
    data: { breadcrumbs: "Markdown Editor" },
  },
  {
    path: "svg_editor",
    component: SvgEditorView,
    title: "SVG Editor",
    data: { breadcrumbs: "SVG Editor" },
  },

  /* Maths */
  {
    path: "prime_number",
    component: PrimeNumberView,
    title: "Prime Number",
    data: { breadcrumbs: "Prime Number" },
  },

  /* Other */
  {
    path: "word_counter",
    component: WordCounterView,
    title: "Word Counter",
    data: { breadcrumbs: "Word Counter" },
  },
  {
    path: "virus_total",
    component: VirusTotalView,
    title: "VirusTotal",
    data: { breadcrumbs: "VirusTotal" },
  },
  {
    path: "color_pallete",
    component: ColorPalleteView,
    title: "Colot Pallete",
    data: { breadcrumbs: "Colot Pallete" },
  },
  {
    path: "key_code",
    component: KeyCodeView,
    title: "JS Key Code Event",
    data: { breadcrumbs: "JS Key Code Event" },
  },
  {
    path: "wheel_fortune",
    component: WheelFortuneView,
    title: "Wheel Fortune",
    data: { breadcrumbs: "Wheel Fortune" },
  },
  {
    path: "uuid_gen",
    component: UuidGeneratorView,
    title: "UUID Generator",
    data: { breadcrumbs: "UUID Generator" },
  },
  {
    path: "url_requests",
    component: UrlRequestsView,
    title: "Url Requests",
    data: { breadcrumbs: "Url Requests" },
  },
];

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  {
    path: "home",
    data: { breadcrumbs: "Home" },
    children: [
      { path: "", component: HomeView, title: "Home", data: { breadcrumbs: "Home" } },
      ...routesLinks,
    ],
  },

  { path: "about", component: AboutView, title: "About", data: { breadcrumbs: "About" } },

  {
    path: "search",
    data: { breadcrumbs: "Search" },
    children: [
      {
        path: "",
        component: SearchPageView,
        title: "Search",
        data: { breadcrumbs: "Search" },
      },
      ...routesLinks,
    ],
  },

  {
    path: "catalogs",
    data: { breadcrumbs: "Catalogs" },
    children: [
      {
        path: "",
        component: CatalogsView,
        title: "Catalogs",
        data: { breadcrumbs: "Catalogs" },
      },
      {
        path: ":id",
        data: { breadcrumbs: "Items", dynamic: true },
        children: [
          { path: "", component: ItemsView, title: "Items", data: { breadcrumbs: "Items" } },
          ...routesLinks,
        ],
      },
    ],
  },

  {
    path: "**",
    component: NotFoundView,
    title: "404 — Not Found",
    data: { breadcrumbs: "404 — Not Found" },
  },
];
