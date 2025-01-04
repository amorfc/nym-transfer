package net.nymtech;

import java.io.IOException;
import java.util.List;
import java.util.Properties;
import lombok.extern.log4j.Log4j2;
import net.nymtech.server.Server;

@Log4j2
final class Main {

  public static void main(String[] args) throws Exception {
    var server = new Server(loadProperties(), List.of((id, r) -> log.info("{} sent!", id)));
    server.run();
  }

  private static Properties loadProperties() throws IOException {
    try (var iStream = Main.class.getClassLoader().getResourceAsStream("application.properties")) {
      var properties = new Properties();
      properties.load(iStream);
      overrideByEnvs(properties);
      return properties;
    } catch (IOException e) {
      log.error("application.properties couldn't be loaded!", e);
      throw e;
    }
  }

  private static void overrideByEnvs(Properties properties) {
    for (var prop : properties.entrySet()) {
      String expectedEnv = prop.getKey().toString().strip().toUpperCase().replace("-", "_");
      String envValue = System.getenv(expectedEnv);
      if (envValue != null) {
        properties.setProperty(prop.getKey().toString(), envValue);
        log.debug("{} set by environment variable {}", prop.getKey().toString(), envValue);
      }
    }
  }

}
