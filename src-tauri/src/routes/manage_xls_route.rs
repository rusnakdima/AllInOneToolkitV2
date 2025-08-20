/* sys lib */
use tauri::State;

/* models */
use crate::{models::response::ResponseModel, AppState};

#[allow(non_snake_case)]
#[tauri::command]
pub fn getDataFileByPathXls(
  state: State<'_, AppState>,
  filePath: String,
) -> Result<ResponseModel, ResponseModel> {
  let manageXlsController = state.manageXlsController.clone();
  let result = manageXlsController.getDataFileByPathXls(filePath);
  result
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn writeDataToFileXls(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
  nameFile: String,
  content: Vec<Vec<String>>,
) -> Result<ResponseModel, ResponseModel> {
  let manageXlsController = state.manageXlsController.clone();
  let result = manageXlsController.writeDataToFileXls(appHandle, nameFile, content);
  result
}
