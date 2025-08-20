/* services */
use crate::services::virus_total_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct VirusTotalController {
  pub virusTotalService: virus_total_service::VirusTotalService,
}

impl VirusTotalController {
  pub fn new() -> Self {
    Self {
      virusTotalService: virus_total_service::VirusTotalService::new(),
    }
  }

  #[allow(non_snake_case)]
  pub async fn virusTotal(&self, url: String) -> Result<ResponseModel, ResponseModel> {
    return self.virusTotalService.reqSite(url).await;
  }
}
