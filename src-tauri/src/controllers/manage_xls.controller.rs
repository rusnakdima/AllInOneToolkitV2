/* services */
use crate::services::manage_xls_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct ManageXlsController {
  pub manageXlsService: manage_xls_service::ManageXlsService,
}

impl ManageXlsController {
  #[allow(non_snake_case)]
  pub fn new(envValue: String) -> Self {
    Self {
      manageXlsService: manage_xls_service::ManageXlsService::new(envValue),
    }
  }

  #[allow(non_snake_case)]
  pub fn getDataFileByPathXls(&self, filePath: String) -> Result<ResponseModel, ResponseModel> {
    return self.manageXlsService.getDataFileByPathXls(filePath);
  }

  #[allow(non_snake_case)]
  pub fn writeDataToFileXls(
    &self,
    appHandle: tauri::AppHandle,
    nameFile: String,
    content: Vec<Vec<String>>,
  ) -> Result<ResponseModel, ResponseModel> {
    return self
      .manageXlsService
      .writeDataToFileXls(appHandle, nameFile, content);
  }
}
