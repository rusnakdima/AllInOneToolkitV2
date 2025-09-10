use std::collections::HashMap;

#[allow(non_snake_case)]
pub struct ConfigHelper {
  pub nameApp: String,
  pub appHomeFolder: String,
}

impl ConfigHelper {
  #[allow(non_snake_case)]
  pub fn new() -> Self {
    let dotenvContent = include_str!("../../.env");
    let envVars = Self::parse_dotenv(dotenvContent);

    Self {
      nameApp: envVars
        .get("NAME_APP")
        .expect("NAME_APP not set in .env")
        .clone(),
      appHomeFolder: envVars
        .get("APP_HOME_FOLDER")
        .expect("APP_HOME_FOLDER not set in .env")
        .clone(),
    }
  }

  #[allow(non_snake_case)]
  fn parse_dotenv(dotenvContent: &str) -> HashMap<String, String> {
    dotenvContent
      .lines()
      .filter_map(|line| {
        if line.trim().is_empty() || line.starts_with('#') {
          return None;
        }
        let mut parts = line.splitn(2, '=');
        let key = parts.next()?.trim().to_string();
        let value = parts.next()?.trim().to_string();
        Some((key, value))
      })
      .collect()
  }
}
