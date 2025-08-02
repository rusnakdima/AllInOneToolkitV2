/* helpers */
use crate::helpers::common::convert_data_to_object;

/* models */
use crate::models::{
  response::{DataValue, Response},
  unicode_data::UnicodeData,
};

pub fn get_info_symbol(type_coding: String, content: String) -> Response {
  let unicode_data: UnicodeData;

  match type_coding.as_str() {
    "symbol" => {
      let char = content.chars().next().unwrap();
      let dec = char as u32;
      let hex = format!("{:x}", char as u32);

      unicode_data = UnicodeData {
        symbol: content,
        dec: format!("&#{}", dec.to_string()),
        hex: format!("U+{}", hex),
      };

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: convert_data_to_object::<UnicodeData>(&unicode_data),
      };
    }
    "dec" => {
      let dec = content.replace("&#", "").trim().parse::<u32>().unwrap_or(0);
      let char = char::from_u32(dec).unwrap();
      let hex = format!("{:x}", char as u32);

      unicode_data = UnicodeData {
        symbol: char.to_string(),
        dec: format!("&#{}", content.replace("&#", "")),
        hex: format!("U+{}", hex),
      };

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: convert_data_to_object::<UnicodeData>(&unicode_data),
      };
    }
    "hex" => {
      let dec =
        u32::from_str_radix(content.to_lowercase().replace("u+", "").trim(), 16).unwrap_or(0);
      let char = char::from_u32(dec).unwrap();

      unicode_data = UnicodeData {
        symbol: char.to_string(),
        dec: format!("&#{}", dec.to_string()),
        hex: format!("U+{}", content.to_lowercase().replace("u+", "")),
      };

      return Response {
        status: "success".to_string(),
        message: "".to_string(),
        data: convert_data_to_object::<UnicodeData>(&unicode_data),
      };
    }
    _ => {
      return Response {
        status: "error".to_string(),
        message: format!("Error: Unknown type!"),
        data: DataValue::String("".to_string()),
      };
    }
  };
}
