/* helpers */
use crate::helpers::common::CommonHelper;

/* models */
use crate::models::{
  response::{DataValue, ResponseModel, ResponseStatus},
  unicode_data::UnicodeData,
};

#[allow(non_snake_case)]
pub struct UnicodeService {
  pub commonHelper: CommonHelper,
}

impl UnicodeService {
  pub fn new() -> Self {
    Self {
      commonHelper: CommonHelper::new(),
    }
  }

  #[allow(non_snake_case)]
  pub fn getInfoSymbol(
    &self,
    typeCoding: String,
    content: String,
  ) -> Result<ResponseModel, ResponseModel> {
    let unicodeData: UnicodeData;

    match typeCoding.as_str() {
      "symbol" => {
        let char = content.chars().next().unwrap();
        let dec = char as u32;
        let hex = format!("{:x}", char as u32);

        unicodeData = UnicodeData {
          symbol: content,
          dec: format!("&#{}", dec.to_string()),
          hex: format!("U+{}", hex),
        };

        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: self
            .commonHelper
            .convertDataToObject::<UnicodeData>(&unicodeData),
        });
      }
      "dec" => {
        let dec = content.replace("&#", "").trim().parse::<u32>().unwrap_or(0);
        let char = char::from_u32(dec).unwrap();
        let hex = format!("{:x}", char as u32);

        unicodeData = UnicodeData {
          symbol: char.to_string(),
          dec: format!("&#{}", content.replace("&#", "")),
          hex: format!("U+{}", hex),
        };

        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: self
            .commonHelper
            .convertDataToObject::<UnicodeData>(&unicodeData),
        });
      }
      "hex" => {
        let dec =
          u32::from_str_radix(content.to_lowercase().replace("u+", "").trim(), 16).unwrap_or(0);
        let char = char::from_u32(dec).unwrap();

        unicodeData = UnicodeData {
          symbol: char.to_string(),
          dec: format!("&#{}", dec.to_string()),
          hex: format!("U+{}", content.to_lowercase().replace("u+", "")),
        };

        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: "".to_string(),
          data: self
            .commonHelper
            .convertDataToObject::<UnicodeData>(&unicodeData),
        });
      }
      _ => {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("Error: Unknown type!"),
          data: DataValue::String("".to_string()),
        });
      }
    };
  }
}
