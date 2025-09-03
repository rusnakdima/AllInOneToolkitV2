/* services */
use crate::services::url_requests_service;

/* models */
use crate::models::{
  collection_data::CollectionData, request_data::RequestData, response::ResponseModel,
};

#[allow(non_snake_case)]
pub struct UrlRequestsController {
  pub urlRequestsService: url_requests_service::UrlRequestsService,
}

impl UrlRequestsController {
  #[allow(non_snake_case)]
  pub fn new(envValue: String) -> Self {
    Self {
      urlRequestsService: url_requests_service::UrlRequestsService::new(envValue),
    }
  }

  #[allow(non_snake_case)]
  pub async fn sendRequest(
    &self,
    infoRequest: RequestData,
  ) -> Result<ResponseModel, ResponseModel> {
    return self.urlRequestsService.sendRequest(infoRequest).await;
  }

  #[allow(non_snake_case)]
  pub fn saveData(
    &self,
    appHandle: tauri::AppHandle,
    listCollections: Vec<CollectionData>,
  ) -> Result<ResponseModel, ResponseModel> {
    return self.urlRequestsService.saveData(appHandle, listCollections);
  }

  #[allow(non_snake_case)]
  pub fn getData(&self, appHandle: tauri::AppHandle) -> Result<ResponseModel, ResponseModel> {
    return self.urlRequestsService.getData(appHandle);
  }
}
