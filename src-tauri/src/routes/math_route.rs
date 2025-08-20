/* sys lib */
use tauri::State;

/* models */
use crate::{models::response::ResponseModel, AppState};

#[allow(non_snake_case)]
#[tauri::command]
pub fn numberIsPrime(
  state: State<'_, AppState>,
  numberStr: String,
) -> Result<ResponseModel, ResponseModel> {
  let mathController = state.mathController.clone();
  let result = mathController.numberIsPrime(numberStr);
  result
}
