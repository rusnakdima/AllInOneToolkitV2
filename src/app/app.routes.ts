/* sys lib */
import { Routes } from "@angular/router";

/* components */
import { HomeComponent } from "@views/home/home.component";
import { AboutComponent } from "@views/about/about.component";
import { SearchPageComponent } from "@views/search-page/search-page.component";
import { CatalogsComponent } from "@views/catalogs/catalogs.component";
import { ItemsComponent } from "@views/items/items.component";

import { NotFoundComponent } from "@views/not-found/not-found.component";

import { UrlEncDecComponent } from "@views/items-pages/url-enc-dec/url-enc-dec.component";
import { Base64EncDecComponent } from "@views/items-pages/base64-enc-dec/base64-enc-dec.component";
import { Md5EncDecComponent } from "@views/items-pages/md5-enc-dec/md5-enc-dec.component";
import { Sha256EncDecComponent } from "@views/items-pages/sha256-enc-dec/sha256-enc-dec.component";

import { VisualDataOnChartComponent } from "@views/items-pages/visual-data-on-chart/visual-data-on-chart.component";
import { ArrayVisualizerComponent } from "@views/items-pages/array-visualizer/array-visualizer.component";
import { CsvToTableComponent } from "@views/items-pages/csv-to-table/csv-to-table.component";
import { JsonToTableComponent } from "@views/items-pages/json-to-table/json-to-table.component";
import { XmlToTableComponent } from "@views/items-pages/xml-to-table/xml-to-table.component";
import { PlistToTableComponent } from "@views/items-pages/plist-to-table/plist-to-table.component";

import { JsonToXmlComponent } from "@views/items-pages/json-to-xml/json-to-xml.component";
import { XmlToJsonComponent } from "@views/items-pages/xml-to-json/xml-to-json.component";
import { XlsToJsonComponent } from "@views/items-pages/xls-to-json/xls-to-json.component";
import { JsonToXlsComponent } from "@views/items-pages/json-to-xls/json-to-xls.component";
import { XlsToXmlComponent } from "@views/items-pages/xls-to-xml/xls-to-xml.component";
import { XmlToXlsComponent } from "@views/items-pages/xml-to-xls/xml-to-xls.component";
import { ClockConverterComponent } from "@views/items-pages/clock-converter/clock-converter.component";
import { UnicodeConverterComponent } from "@views/items-pages/unicode-converter/unicode-converter.component";

import { MarkdownEditorComponent } from "@views/items-pages/markdown-editor/markdown-editor.component";
import { SvgEditorComponent } from "@views/items-pages/svg-editor/svg-editor.component";

import { WordCounterComponent } from "@views/items-pages/word-counter/word-counter.component";
import { VirusTotalComponent } from "@views/items-pages/virus-total/virus-total.component";
import { KeyCodeComponent } from "@views/items-pages/key-code/key-code.component";
import { ColorPalleteComponent } from "@views/items-pages/color-pallete/color-pallete.component";
import { WheelFortuneComponent } from "@views/items-pages/wheel-fortune/wheel-fortune.component";
import { CssConverterComponent } from "@views/items-pages/css-converter/css-converter.component";
import { UuidGeneratorComponent } from "@views/items-pages/uuid-generator/uuid-generator.component";

const routesLinks: Routes = [
  { path: "url_enc_dec", component: UrlEncDecComponent, title: "URL Encode/Decode", data: { breadcrumbs: "URL Encode/Decode" }, },
  { path: "base64_enc_dec", component: Base64EncDecComponent, title: "Base64 Encode/Decode", data: { breadcrumbs: "Base64 Encode/Decode" }, },
  { path: "md5_enc_dec", component: Md5EncDecComponent, title: "MD5 Encode/Decode", data: { breadcrumbs: "MD5 Encode/Decode" }, },
  { path: "sha256_enc_dec", component: Sha256EncDecComponent, title: "SHA256 Encode/Decode", data: { breadcrumbs: "SHA256 Encode/Decode" }, },

  { path: 'visual_data_chart', component: VisualDataOnChartComponent, title: "Visualization data on chart", data: { breadcrumbs: "Visualization data on chart" } },
  { path: 'array_visualizer', component: ArrayVisualizerComponent, title: "Array Visualizer", data: { breadcrumbs: "Array Visualizer" } },
  { path: 'csv_to_table', component: CsvToTableComponent, title: "CSV visualizer in Table", data: { breadcrumbs: "CSV visualizer in Table" } },
  { path: 'json_to_table', component: JsonToTableComponent, title: "JSON visualizer in Table", data: { breadcrumbs: "JSON visualizer in Table" } },
  { path: 'xml_to_table', component: XmlToTableComponent, title: "XML visualizer in Table", data: { breadcrumbs: "XML visualizer in Table" } },
  { path: 'plist_to_table', component: PlistToTableComponent, title: "Plist Viewer", data: { breadcrumbs: "Plist Viewer" } },

  { path: "json_to_xml", component: JsonToXmlComponent, title: "Convert JSON to XML", data: { breadcrumbs: "Convert" }, },
  { path: "xml_to_json", component: XmlToJsonComponent, title: "Convert XML to JSON", data: { breadcrumbs: "Convert XML to JSON" }, },  
  { path: "xls_to_json", component: XlsToJsonComponent, title: "Convert XLS to JSON", data: { breadcrumbs: "Convert XLS to JSON" }, },
  { path: "json_to_xls", component: JsonToXlsComponent, title: "Convert JSON to XLS", data: { breadcrumbs: "Convert JSON to XLS" }, },
  { path: "xls_to_xml", component: XlsToXmlComponent, title: "Convert XLS to XML", data: { breadcrumbs: "Convert XLS to XML" }, },
  { path: "xml_to_xls", component: XmlToXlsComponent, title: "Convert XML to XLS", data: { breadcrumbs: "Convert XML to XLS" }, },
  { path: "clock_converter", component: ClockConverterComponent, title: "Clock Converter", data: { breadcrumbs: "Clock Converter" }, },
  { path: "unicode_converter", component: UnicodeConverterComponent, title: "Unicode Converter", data: { breadcrumbs: "Unicode Converter" }, },

  { path: "md_editor", component: MarkdownEditorComponent, title: 'Markdown Editor', data: { breadcrumbs: "Markdown Editor" } },
  { path: "svg_editor", component: SvgEditorComponent, title: 'SVG Editor', data: { breadcrumbs: "SVG Editor" } },

  { path: "word_counter", component: WordCounterComponent, title: "Word Counter", data: { breadcrumbs: "Word Counter" }, },
  { path: "virus_total", component: VirusTotalComponent, title: "VirusTotal", data: { breadcrumbs: "VirusTotal" }, },
  { path: "color_pallete", component: ColorPalleteComponent, title: "Colot Pallete", data: { breadcrumbs: "Colot Pallete" }, },
  { path: "key_code", component: KeyCodeComponent, title: "JS Key Code Event", data: { breadcrumbs: "JS Key Code Event" }, },
  { path: "wheel_fortune", component: WheelFortuneComponent, title: 'Wheel Fortune', data: { breadcrumbs: "Wheel Fortune" } },
  { path: "css_converter", component: CssConverterComponent, title: 'CSS Converter', data: { breadcrumbs: "CSS Converter" } },
  { path: "uuid_gen", component: UuidGeneratorComponent, title: 'UUID Generator', data: { breadcrumbs: "UUID Generator" } },
];

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "home", data: { breadcrumbs: "Home" }, children: [
    { path: "", component: HomeComponent, title: "Home", data: { breadcrumbs: "Home" }, },
    ...routesLinks,
  ] },

  { path: "about", component: AboutComponent, title: "About", data: { breadcrumbs: "About" }, },

  { path: "search", data: { breadcrumbs: "Search" }, children: [
    { path: "", component: SearchPageComponent, title: "Search", data: { breadcrumbs: "Search" }, },
    ...routesLinks
  ] },

  { path: "catalogs", data: { breadcrumbs: "Catalogs" }, children: [
    { path: "", component: CatalogsComponent, title: "Catalogs", data: { breadcrumbs: "Catalogs" }, },
    { path: ":id", data: { breadcrumbs: "Items", dynamic: true }, children: [
      { path: "", component: ItemsComponent, title: "Items", data: { breadcrumbs: "Items" }, },
      ...routesLinks,
    ], },
  ], },

  { path: "**", component: NotFoundComponent, title: "404 — Not Found", data: { breadcrumbs: "404 — Not Found" }, },
];
