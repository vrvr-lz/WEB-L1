import java.util.logging.Level;
import java.util.logging.Logger;

public class Validator {
    Logger log = Logger.getLogger(this.getClass().getName());

    public boolean checkPoint(double[] findings) {
        log.setLevel(Level.INFO);
        return validate(findings[0], findings[1], findings[2]);
    }

    private boolean validate(double x, double y, double r) {
        if (x * r >= 0 && y * r >= 0) {
            return inCircle(x, y, r);
        } else if (x * r <= 0 && y * r >= 0) {
            return inRectangle(x, y, r);
        } else if (x * r <= 0 && y * r <= 0) {
            return inTriangle(x, y, r);
        } else if (x * r >= 0 && y * r <= 0) {
            return false;
        } else return x == 0 && y == 0;
    }

    private boolean inTriangle(double x, double y, double r) {
        return x <= 0 && y <= 0 && x >= -r / 2 && y >= -r / 2 && y >= -x - r / 2;
    }

    private boolean inRectangle(double x, double y, double r) {
        return x >= -r && x <= 0 && y >= 0 && y <= r / 2;
    }

    private boolean inCircle(double x, double y, double r) {
        return x >= 0 && y >= 0 && Math.sqrt(x * x + y * y) <= r;
    }
}
