/* services */
use crate::services::math_service;

/* models */
use crate::models::response::ResponseModel;

#[allow(non_snake_case)]
pub struct MathController {
  pub mathService: math_service::MathService,
}

impl MathController {
  pub fn new() -> Self {
    Self {
      mathService: math_service::MathService::new(),
    }
  }

  #[allow(non_snake_case)]
  pub fn numberIsPrime(&self, numberStr: String) -> Result<ResponseModel, ResponseModel> {
    self.mathService.numberIsPrime(numberStr)
  }
}
