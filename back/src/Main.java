import com.fastcgi.FCGIInterface;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class Main {
    private static final String RESPONSE_TEMPLATE = "HTTP/1.1 200 OK\n" +
            "Content-Type: application/json\n" +
            "Access-Control-Allow-Origin: *\n" +
            "Access-Control-Allow-Methods: POST\n" +
            "Access-Control-Allow-Headers: *\n" +
            "Access-Control-Allow-Credentials: true\n" +
            "Content-Length: %d\n\n%s";

    // Создаем DecimalFormat с учетом локали для корректного отображения запятой в дробных числах
    private static final DecimalFormat decimalFormat;

    static {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.forLanguageTag("ru"));
        symbols.setDecimalSeparator(',');
        decimalFormat = new DecimalFormat("#.##", symbols);
    }

    public static void main(String[] args) {
        var validator = new Validator();
        var fcgiInterface = new FCGIInterface();

        while (fcgiInterface.FCGIaccept() >= 0) {
            Instant executionStart = Instant.now();

            try {
                var request = new Request();
                request.fillBody(FCGIInterface.request.params);
                var requestBody = request.getBody();

                // Получаем параметры x, y и r из тела запроса
                double x = Double.parseDouble(requestBody.get("x").toString());
                double y = Double.parseDouble(requestBody.get("y").toString());
                double r = Double.parseDouble(requestBody.get("r").toString());

                // Проверяем, действительны ли параметры
                boolean isValid = validator.checkPoint(new double[]{x, y, r});

                // Формируем ответ в JSON формате
                String jsonResponse = String.format(
                        "{\"x\": \"%s\", \"y\": \"%s\", \"r\": \"%s\", \"hit\": %b, \"time\": \"%s\", \"executionTime\": %d}",
                        formatNumber(x), formatNumber(y), formatNumber(r), isValid, now(), getExecutionTimeNs(executionStart)
                );

                sendJson(jsonResponse);
            } catch (NumberFormatException e) {
                sendJson("{\"error\": \"Неверный тип параметра\"}");
            } catch (NullPointerException e) {
                sendJson("{\"error\": \"Отсутствует необходимый параметр\"}");
            } catch (Exception e) {
                sendJson(String.format("{\"error\": \"%s\"}", e.getMessage()));
            }
        }
    }

    // Метод для форматирования чисел, который сохраняет дробные части и корректно отображает запятые
    private static String formatNumber(double value) {
        if (value == 0) {
            return "0"; // Для нуля выводим просто 0
        } else {
            return decimalFormat.format(value);
        }
    }

    private static long getExecutionTimeNs(Instant executionStart) {
        return Duration.between(executionStart, Instant.now()).toNanos();
    }

    private static String now() {
        return DateTimeFormatter.ofPattern("HH:mm:ss").format(LocalDateTime.now());
    }

    private static void sendJson(String jsonDump) {
        System.out.println(String.format(RESPONSE_TEMPLATE, jsonDump.getBytes(StandardCharsets.UTF_8).length, jsonDump));
    }
}
