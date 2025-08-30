/* models */
use crate::models::response::{DataValue, ResponseModel, ResponseStatus};

#[allow(non_snake_case)]
pub struct MathService;

impl MathService {
  pub fn new() -> Self {
    Self
  }

  #[allow(non_snake_case)]
  pub fn numberIsPrime(&self, numberStr: String) -> Result<ResponseModel, ResponseModel> {
    if numberStr.is_empty() || !numberStr.chars().all(|c| c.is_digit(10)) {
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Input must be a valid non-empty number".to_string(),
        data: DataValue::String("".to_string()),
      });
    }

    if let Ok(num) = numberStr.parse::<u64>() {
      if num <= 1 {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("{} is not a prime number.", num),
          data: DataValue::Bool(false),
        });
      }
      if num <= 3 {
        return Ok(ResponseModel {
          status: ResponseStatus::Success,
          message: format!("{} is a prime number.", num),
          data: DataValue::Bool(true),
        });
      }
      if num % 2 == 0 || num % 3 == 0 {
        return Err(ResponseModel {
          status: ResponseStatus::Error,
          message: format!("{} is not a prime number.", num),
          data: DataValue::Bool(false),
        });
      }

      let mut i = 5;
      while i * i <= num {
        if num % i == 0 || num % (i + 2) == 0 {
          return Err(ResponseModel {
            status: ResponseStatus::Error,
            message: format!("{} is not a prime number.", num),
            data: DataValue::Bool(false),
          });
        }
        i += 6;
      }

      return Ok(ResponseModel {
        status: ResponseStatus::Success,
        message: format!("{} is a prime number.", num),
        data: DataValue::Bool(true),
      });
    } else {
      // The number is too large to fit in a u64, and this implementation
      // cannot handle big integers. The previous logic for this case was flawed.
      return Err(ResponseModel {
        status: ResponseStatus::Error,
        message: "Input number is too large to be checked for primality.".to_string(),
        data: DataValue::String("".to_string()),
      });
    }
  }
}
