/* sys lib */
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct UnicodeData {
  pub symbol: String,
  pub dec: String,
  pub hex: String,
}