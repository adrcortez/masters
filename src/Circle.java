import java.awt.geom.GeneralPath;


public class Circle {
	
	private final double radian = Math.PI/180;
	private double radius;
	private double x;
	private double y;
	
	public Circle(double radius) {
		this.setRadius(radius);
		this.setX(0);
		this.setY(0);
	}
	
	public Circle(double radius, double x, double y) {
		this.setRadius(radius);
		this.setX(x);
		this.setY(y);
	}

	public double getRadius() {
		return radius;
	}

	public void setRadius(double radius) {
		this.radius = radius;
	}

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}
	
	public boolean intersects(Circle c) {
		double sr = this.getRadius() + c.getRadius();
		double dr = this.getRadius() - c.getRadius();
		double dx = this.getX() - c.getX();
		double dy = this.getY() - c.getY();
		double dxy = dx*dx + dy*dy;
		
		return (dr*dr <= dxy) && (dxy <= sr*sr);
	}
	
	public GeneralPath getPath() {
		
		double centerX = this.getX();
		double centerY = this.getY();
        double end = 360 * radian;
        double a = this.getRadius();

        GeneralPath path = new GeneralPath();
        path.moveTo(centerX + a, centerY);
        
        for (double theta = 0; theta < end; theta += radian) {
            double r = a;
            double x = Math.cos(theta) * r + centerX;
            double y = Math.sin(theta) * r + centerY;
            path.lineTo(x, y);
        }
        
        return path;
	}
}
