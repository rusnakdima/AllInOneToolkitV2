/* services */
use crate::services::about_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct AboutController {
  pub aboutService: about_service::AboutService,
}

impl AboutController {
  pub fn new() -> Self {
    Self {
      aboutService: about_service::AboutService::new(),
    }
  }

  #[allow(non_snake_case)]
  pub async fn downloadUpdate(
    &self,
    appHandle: tauri::AppHandle,
    url: String,
    fileName: String,
  ) -> Result<ResponseModel, ResponseModel> {
    return self
      .aboutService
      .downloadFile(appHandle, url, fileName)
      .await;
  }

  #[allow(non_snake_case)]
  pub async fn getBinaryNameFile(&self) -> Result<ResponseModel, ResponseModel> {
    return self.aboutService.getBinaryNameFile().await;
  }
}
