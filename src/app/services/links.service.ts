/* sys lib */
import { Injectable } from '@angular/core';

/* models */
import { Catalog } from '@models/catalog';
import { Link } from '@models/link';

/* consts */
const catalogs: Array<Catalog> = [
  {
    id: "6a1cbef0-7f5f-4cea-9326-93912ada7070",
    name: "Encoders/Decoders",
    icon: "https://cdn-icons-png.flaticon.com/512/2362/2362273.png",
  },
  {
    id: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    name: "Visualisers",
    icon: "https://cdn-icons-png.flaticon.com/512/11232/11232253.png",
  },
  {
    id: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    name: "Converters",
    icon: "https://cdn-icons-png.flaticon.com/512/2521/2521843.png",
  },
  {
    id: "accc1901-0ccb-411b-8d23-b8d4c9a2ff76",
    name: "Editors",
    icon: "https://cdn-icons-png.flaticon.com/512/11185/11185163.png",
  },
  {
    id: "02efe6b2-f454-4772-82d6-3e680aabb071",
    name: "Maths",
    icon: "https://cdn-icons-png.flaticon.com/512/939/939364.png",
  },
  {
    id: "338877bc-753f-4d89-9cda-ddad646baa52",
    name: "Other",
    icon: "https://cdn-icons-png.flaticon.com/512/3388/3388774.png",
  },
];

const links: Array<Link> = [
  /* Encoders/Decoders */
  {
    id: "7b99ed04-25c2-4991-b170-9425cb5a4fc0",
    catalog: "6a1cbef0-7f5f-4cea-9326-93912ada7070",
    title: "URL Encode/Decode",
    url: "url_enc_dec",
    icon: ["https://cdn-icons-png.flaticon.com/512/5229/5229294.png"],
  },
  {
    id: "b480c802-8a58-4152-a40d-1a2f0a89d29f",
    catalog: "6a1cbef0-7f5f-4cea-9326-93912ada7070",
    title: "Base64 Encode/Decode",
    url: "base64_enc_dec",
    icon: ["https://cdn-icons-png.flaticon.com/512/3093/3093179.png"],
  },
  {
    id: "3a610e48-ad52-40d2-b3af-2c1c90360f4f",
    catalog: "6a1cbef0-7f5f-4cea-9326-93912ada7070",
    title: "MD5 Encode/Decode",
    url: "md5_enc_dec",
    icon: ["https://cdn-icons-png.flaticon.com/512/14422/14422103.png"],
  },
  {
    id: "35c21700-ec17-4f33-bac0-7b32af111447",
    catalog: "6a1cbef0-7f5f-4cea-9326-93912ada7070",
    title: "SHA256 Encode/Decode",
    url: "sha256_enc_dec",
    icon: ["https://cdn-icons-png.flaticon.com/512/5844/5844831.png"],
  },

  /* Visualisers */
  {
    id: "a46918cf-3209-4011-8ae4-acd17d3af4f9",
    catalog: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    title: "Visualization data on chart",
    url: "visual_data_chart",
    icon: ["https://cdn-icons-png.flaticon.com/512/893/893220.png"],
  },
  {
    id: "23384467-97af-461d-860d-4f8e1e725d63",
    catalog: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    title: "Array Visualizer",
    url: "array_visualizer",
    icon: ["https://cdn-icons-png.flaticon.com/512/4799/4799899.png"],
  },
  {
    id: "29b9fb4e-73c5-45d7-98a6-26c40cadb3a5",
    catalog: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    title: "CSV visualizer in Table",
    url: "csv_to_table",
    icon: ["https://cdn-icons-png.flaticon.com/512/1126/1126902.png"],
  },
  {
    id: "0cd415aa-8b75-479f-9edd-4e4c1f847b9a",
    catalog: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    title: "JSON visualizer in Table",
    url: "json_to_table",
    icon: ["https://cdn-icons-png.flaticon.com/512/136/136525.png"],
  },
  {
    id: "bd464862-0e4d-4cbb-84e8-8e35ad7dbbc0",
    catalog: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    title: "XML visualizer in Table",
    url: "xml_to_table",
    icon: ["https://cdn-icons-png.flaticon.com/512/136/136526.png"],
  },
  {
    id: "0c1edd01-dba6-4f0c-a95e-1c0ea040b94b",
    catalog: "ffa49591-fe05-43b5-a0fc-53ec90a7d3a7",
    title: "Plist Viewer",
    url: "plist_to_table",
    icon: [
      "https://i0.wp.com/apptyrant.com/wordpress/wp-content/uploads/2023/05/Plistdocumenticonimage.png.webp?resize=300%2C300&ssl=1",
    ],
  },

  /* Converters */
  {
    id: "8e0f75dc-cbb7-43e4-b857-022d16a16888",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Convert JSON to XML",
    url: "json_to_xml",
    icon: [
      "https://cdn-icons-png.flaticon.com/512/136/136525.png",
      "https://cdn-icons-png.flaticon.com/512/892/892655.png",
      "https://cdn-icons-png.flaticon.com/512/136/136526.png",
    ],
  },
  {
    id: "16d4bf55-86c5-416b-becf-7f6e98e0d657",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Convert XML to JSON",
    url: "xml_to_json",
    icon: [
      "https://cdn-icons-png.flaticon.com/512/136/136526.png",
      "https://cdn-icons-png.flaticon.com/512/892/892655.png",
      "https://cdn-icons-png.flaticon.com/512/136/136525.png",
    ],
  },
  {
    id: "14992c43-6fc6-4367-8928-03b605a2db42",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Convert JSON to XLS",
    url: "json_to_xls",
    icon: [
      "https://cdn-icons-png.flaticon.com/512/136/136525.png",
      "https://cdn-icons-png.flaticon.com/512/892/892655.png",
      "https://cdn-icons-png.flaticon.com/512/8263/8263105.png",
    ],
  },
  {
    id: "0d6e70a3-263e-40f5-ba64-f3fdc04d42b6",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Convert XLS to JSON",
    url: "xls_to_json",
    icon: [
      "https://cdn-icons-png.flaticon.com/512/8263/8263105.png",
      "https://cdn-icons-png.flaticon.com/512/892/892655.png",
      "https://cdn-icons-png.flaticon.com/512/136/136525.png",
    ],
  },
  {
    id: "0096b7ae-eee1-4600-815a-e6ffb45f6c58",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Convert XML to XLS",
    url: "xml_to_xls",
    icon: [
      "https://cdn-icons-png.flaticon.com/512/136/136526.png",
      "https://cdn-icons-png.flaticon.com/512/892/892655.png",
      "https://cdn-icons-png.flaticon.com/512/8263/8263105.png",
    ],
  },
  {
    id: "6912c357-81f7-4905-b0ee-3beb00268905",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Convert XLS to XML",
    url: "xls_to_xml",
    icon: [
      "https://cdn-icons-png.flaticon.com/512/8263/8263105.png",
      "https://cdn-icons-png.flaticon.com/512/892/892655.png",
      "https://cdn-icons-png.flaticon.com/512/136/136526.png",
    ],
  },
  {
    id: "a5a84f36-6eb2-44d3-accb-d912b5224f1c",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Clock Converter",
    url: "clock_converter",
    icon: ["https://cdn-icons-png.flaticon.com/512/3652/3652191.png"],
  },
  {
    id: "03eafbde-6916-4d5b-865b-cf677726e5a6",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "Unicode Converter",
    url: "unicode_converter",
    icon: [
      "https://cdn.iconscout.com/icon/premium/png-256-thumb/unicode-2752041-2284858.png?f=webp",
    ],
  },
  {
    id: "e58220c8-07b8-45ce-bfc8-618364787739",
    catalog: "8a3e4b18-e9ed-469d-87ff-c7f18731a335",
    title: "CSS Converter",
    url: "css_converter",
    icon: ["https://cdn-icons-png.flaticon.com/512/136/136527.png"],
  },

  /* Editors */
  {
    id: "75bcfb42-ec6d-4c3b-9862-586bcd277fbc",
    catalog: "accc1901-0ccb-411b-8d23-b8d4c9a2ff76",
    title: "Markdown Editor",
    url: "md_editor",
    icon: ["https://cdn-icons-png.flaticon.com/512/14422/14422333.png"],
  },
  {
    id: "28b81474-b433-425b-8246-907a59e31359",
    catalog: "accc1901-0ccb-411b-8d23-b8d4c9a2ff76",
    title: "SVG Editor",
    url: "svg_editor",
    icon: ["https://cdn-icons-png.flaticon.com/512/136/136537.png"],
  },

  /* Maths */
  {
    id: "1bf25b0b-436f-4017-9ebc-f8a0c2c4bdcc",
    catalog: "02efe6b2-f454-4772-82d6-3e680aabb071",
    title: "Prime number",
    url: "prime_number",
    icon: ["https://cdn-icons-png.flaticon.com/512/4002/4002516.png"],
  },

  /* Other */
  {
    id: "6cd78d43-1da1-4b5b-916d-26e777360264",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "Word counter",
    url: "word_counter",
    icon: ["https://cdn-icons-png.flaticon.com/512/7603/7603910.png"],
  },
  {
    id: "904def6c-10b3-4b49-afbb-98ea3ed98b30",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "VirusTotal",
    url: "virus_total",
    icon: ["https://cdn-icons-png.flaticon.com/512/7975/7975064.png"],
  },
  {
    id: "c0496596-5f9a-4d4c-9767-c34fff35cf82",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "Colot Pallete",
    url: "color_pallete",
    icon: ["https://cdn-icons-png.flaticon.com/512/5223/5223048.png"],
  },
  {
    id: "5d1e21a7-61b0-447d-93a4-c60ea17f0576",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "JS Key Code Event",
    url: "key_code",
    icon: ["https://cdn-icons-png.flaticon.com/512/124/124125.png"],
  },
  {
    id: "0b8771c0-e317-42af-8e25-1eaf2cec3957",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "Wheel Fortune",
    url: "wheel_fortune",
    icon: ["https://cdn-icons-png.flaticon.com/512/6452/6452683.png"],
  },
  {
    id: "b55d2f0f-9b39-48a2-8bae-9b75a2a36a67",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "UUID Generator",
    url: "uuid_gen",
    icon: ["https://cdn-icons-png.flaticon.com/512/16921/16921758.png"],
  },
  {
    id: "d232aa09-a857-44b0-9c43-abf65edd815c",
    catalog: "338877bc-753f-4d89-9cda-ddad646baa52",
    title: "Url Requests",
    url: "url_requests",
    icon: ["https://cdn-icons-png.flaticon.com/512/3957/3957993.png"],
  },
];

@Injectable({
  providedIn: 'root'
})
export class LinksService {
  constructor() { }

  getCatalogs(): Array<Catalog> {
    return catalogs;
  }

  getLinksByCatalog(catalogId: string): Array<Link> {
    return links.filter(link => link.catalog === catalogId);
  }

  getIconLink(linkId: string): string {
    return links.find(link => link.id === linkId)?.url ?? '';
  }

  getAllLinks(): Array<Link> {
    return links;
  }
}
