/* services */
use crate::services::manage_file_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct ManageFileController {
  pub manageFileService: manage_file_service::ManageFileService,
}

impl ManageFileController {
  pub fn new() -> Self {
    Self {
      manageFileService: manage_file_service::ManageFileService::new(),
    }
  }

  #[allow(non_snake_case)]
  pub fn chooseFile(
    &self,
    appHandle: tauri::AppHandle,
    typeFile: Vec<&str>,
  ) -> Result<ResponseModel, ResponseModel> {
    return self.manageFileService.openDialogWindow(appHandle, typeFile);
  }

  #[allow(non_snake_case)]
  pub fn getDataFileByPath(&self, filePath: String) -> Result<ResponseModel, ResponseModel> {
    return self.manageFileService.getDataFileByPath(filePath);
  }

  #[allow(non_snake_case)]
  pub fn writeDataToFile(
    &self,
    appHandle: tauri::AppHandle,
    nameFile: String,
    content: String,
    extension: String,
  ) -> Result<ResponseModel, ResponseModel> {
    return self
      .manageFileService
      .writeDataToFile(appHandle, nameFile, content, extension);
  }

  #[allow(non_snake_case)]
  pub fn openFolderWithFile(&self, path: String) -> Result<ResponseModel, ResponseModel> {
    return self.manageFileService.openFolderWithFile(path);
  }

  #[allow(non_snake_case)]
  pub fn openFileInApp(&self, path: String) -> Result<ResponseModel, ResponseModel> {
    return self.manageFileService.openFile(path);
  }
}
