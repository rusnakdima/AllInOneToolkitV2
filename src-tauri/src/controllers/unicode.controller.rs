/* services */
use crate::services::unicode_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct UnicodeController {
  pub unicodeService: unicode_service::UnicodeService,
}

impl UnicodeController {
  pub fn new() -> Self {
    Self {
      unicodeService: unicode_service::UnicodeService::new(),
    }
  }

  #[allow(non_snake_case)]
  pub fn getInfoSymbol(
    &self,
    typeCoding: String,
    content: String,
  ) -> Result<ResponseModel, ResponseModel> {
    self.unicodeService.getInfoSymbol(typeCoding, content)
  }
}
