/* services */
use crate::services::about_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct AboutController {
  pub aboutService: about_service::AboutService,
}

impl AboutController {
  #[allow(non_snake_case)]
  pub fn new(envValue: String) -> Self {
    Self {
      aboutService: about_service::AboutService::new(envValue),
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
