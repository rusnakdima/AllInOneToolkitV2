/* sys lib */
use tauri::State;

/* models */
use crate::{
  models::{collection_data::CollectionData, request_data::RequestData, response::ResponseModel},
  AppState,
};

#[allow(non_snake_case)]
#[tauri::command]
pub async fn sendRequest(
  state: State<'_, AppState>,
  infoRequest: RequestData,
) -> Result<ResponseModel, ResponseModel> {
  let urlRequestsController = state.urlRequestsController.clone();
  let result = urlRequestsController.sendRequest(infoRequest).await;
  result
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn saveData(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
  listCollections: Vec<CollectionData>,
) -> Result<ResponseModel, ResponseModel> {
  let urlRequestsController = state.urlRequestsController.clone();
  let result = urlRequestsController.saveData(appHandle, listCollections);
  result
}

#[allow(non_snake_case)]
#[tauri::command]
pub fn getData(
  state: State<'_, AppState>,
  appHandle: tauri::AppHandle,
) -> Result<ResponseModel, ResponseModel> {
  let urlRequestsController = state.urlRequestsController.clone();
  let result = urlRequestsController.getData(appHandle);
  result
}
