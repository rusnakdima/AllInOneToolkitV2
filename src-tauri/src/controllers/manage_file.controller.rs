/* services */
use crate::services::manage_file_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct ManageFileController {
  pub manageFileService: manage_file_service::ManageFileService,
}

impl ManageFileController {
  #[allow(non_snake_case)]
  pub fn new(envValue: String) -> Self {
    Self {
      manageFileService: manage_file_service::ManageFileService::new(envValue),
    }
  }

  #[allow(non_snake_case)]
  pub fn chooseFile(
    &self,
    appHandle: tauri::AppHandle,
    typeFile: Vec<&str>,
  ) -> Result<ResponseModel, ResponseModel> {
    self.manageFileService.openDialogWindow(appHandle, typeFile)
  }

  #[allow(non_snake_case)]
  pub fn getDataFileByPath(&self, filePath: String) -> Result<ResponseModel, ResponseModel> {
    self.manageFileService.getDataFileByPath(filePath)
  }

  #[allow(non_snake_case)]
  pub fn writeDataToFile(
    &self,
    appHandle: tauri::AppHandle,
    nameFile: String,
    content: String,
    extension: String,
  ) -> Result<ResponseModel, ResponseModel> {
    self
      .manageFileService
      .writeDataToFile(appHandle, nameFile, content, extension)
  }

  #[allow(non_snake_case)]
  pub fn openFolderWithFile(&self, path: String) -> Result<ResponseModel, ResponseModel> {
    self.manageFileService.openFolderWithFile(path)
  }

  #[allow(non_snake_case)]
  pub fn openFileInApp(&self, path: String) -> Result<ResponseModel, ResponseModel> {
    self.manageFileService.openFile(path)
  }
}
